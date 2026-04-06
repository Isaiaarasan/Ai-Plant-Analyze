package com.aiplantanalyze.controller;

import com.aiplantanalyze.model.Comment;
import com.aiplantanalyze.model.Post;
import com.aiplantanalyze.model.User;
import com.aiplantanalyze.repository.CommentRepository;
import com.aiplantanalyze.repository.PostRepository;
import com.aiplantanalyze.repository.UserRepository;
import com.aiplantanalyze.security.AuthService;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ForumController(PostRepository postRepository,
                           CommentRepository commentRepository,
                           UserRepository userRepository,
                           AuthService authService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getPosts() {
        try {
            List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
            List<Map<String, Object>> response = new ArrayList<>();
            for (Post post : posts) {
                response.add(buildPostResponse(post));
            }
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Post not found"));
            }
            return ResponseEntity.ok(buildPostResponse(optionalPost.get()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(HttpServletRequest request,
                                        @RequestBody Map<String, String> body) {
        try {
            User user = authService.getRequiredUser(request);
            String title = body.get("title");
            String content = body.get("content");
            if (title == null || content == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Title and content are required"));
            }
            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setAuthorId(user.getId());
            Post savedPost = postRepository.save(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(buildPostResponse(savedPost));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(HttpServletRequest request,
                                        @PathVariable String id,
                                        @RequestBody Map<String, String> body) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Post not found"));
            }
            Post post = optionalPost.get();
            if (!Objects.equals(post.getAuthorId(), user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Not authorized to update this post"));
            }
            if (body.containsKey("title")) {
                post.setTitle(body.get("title"));
            }
            if (body.containsKey("content")) {
                post.setContent(body.get("content"));
            }
            post.setUpdatedAt(new Date());
            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(buildPostResponse(updatedPost));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(HttpServletRequest request, @PathVariable String id) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Post not found"));
            }
            Post post = optionalPost.get();
            if (!Objects.equals(post.getAuthorId(), user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Not authorized to delete this post"));
            }
            commentRepository.deleteAllById(post.getCommentIds());
            postRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(HttpServletRequest request,
                                        @PathVariable String id,
                                        @RequestBody Map<String, String> body) {
        try {
            User user = authService.getRequiredUser(request);
            String content = body.get("content");
            if (content == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Comment content is required"));
            }
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Post not found"));
            }
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setAuthorId(user.getId());
            comment.setPostId(id);
            Comment savedComment = commentRepository.save(comment);
            Post post = optionalPost.get();
            post.getCommentIds().add(savedComment.getId());
            postRepository.save(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(buildCommentResponse(savedComment));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(HttpServletRequest request,
                                           @PathVariable String id,
                                           @PathVariable String commentId) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Comment> optionalComment = commentRepository.findById(commentId);
            if (optionalComment.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Comment not found"));
            }
            Comment comment = optionalComment.get();
            if (!Objects.equals(comment.getAuthorId(), user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Not authorized to delete this comment"));
            }
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.getCommentIds().remove(commentId);
                postRepository.save(post);
            }
            commentRepository.deleteById(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<?> likePost(HttpServletRequest request, @PathVariable String id) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Post not found"));
            }
            Post post = optionalPost.get();
            if (post.getLikes().contains(user.getId())) {
                post.getLikes().remove(user.getId());
            } else {
                post.getLikes().add(user.getId());
            }
            postRepository.save(post);
            return ResponseEntity.ok(Map.of("likes", post.getLikes(), "likeCount", post.getLikes().size()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(HttpServletRequest request,
                                         @PathVariable String id,
                                         @PathVariable String commentId) {
        try {
            User user = authService.getRequiredUser(request);
            Optional<Comment> optionalComment = commentRepository.findById(commentId);
            if (optionalComment.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Comment not found"));
            }
            Comment comment = optionalComment.get();
            if (comment.getLikes().contains(user.getId())) {
                comment.getLikes().remove(user.getId());
            } else {
                comment.getLikes().add(user.getId());
            }
            commentRepository.save(comment);
            return ResponseEntity.ok(Map.of("likes", comment.getLikes(), "likeCount", comment.getLikes().size()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error", "error", ex.getMessage()));
        }
    }

    private Map<String, Object> buildPostResponse(Post post) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", post.getId());
        response.put("title", post.getTitle());
        response.put("content", post.getContent());
        response.put("author", buildUserSummary(post.getAuthorId()));
        response.put("likes", post.getLikes());
        response.put("likeCount", post.getLikes().size());

        List<Map<String, Object>> comments = new ArrayList<>();
        for (String commentId : post.getCommentIds()) {
            commentRepository.findById(commentId).ifPresent(comment -> comments.add(buildCommentResponse(comment)));
        }
        response.put("comments", comments);
        response.put("createdAt", post.getCreatedAt());
        response.put("updatedAt", post.getUpdatedAt());
        return response;
    }

    private Map<String, Object> buildCommentResponse(Comment comment) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", comment.getId());
        response.put("content", comment.getContent());
        response.put("author", buildUserSummary(comment.getAuthorId()));
        response.put("likes", comment.getLikes());
        response.put("likeCount", comment.getLikes().size());
        response.put("createdAt", comment.getCreatedAt());
        response.put("updatedAt", comment.getUpdatedAt());
        return response;
    }

    private Map<String, Object> buildUserSummary(String userId) {
        Map<String, Object> author = new HashMap<>();
        if (userId == null) {
            author.put("username", "Unknown");
            return author;
        }
        Optional<User> optionalUser = userRepository.findById(userId);
        author.put("_id", userId);
        author.put("username", optionalUser.map(User::getUsername).orElse("Unknown"));
        return author;
    }
}
