package com.aiplantanalyze.model;

public class Stats {
    private int scans = 0;
    private int plants = 0;
    private int badges = 0;

    public Stats() {
    }

    public int getScans() {
        return scans;
    }

    public void setScans(int scans) {
        this.scans = scans;
    }

    public int getPlants() {
        return plants;
    }

    public void setPlants(int plants) {
        this.plants = plants;
    }

    public int getBadges() {
        return badges;
    }

    public void setBadges(int badges) {
        this.badges = badges;
    }
}
