import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";
import { useState } from 'react'

const Sidebar = () => {
    return (
        <div id="sidebar">
            <div id="credits" className="sidebar-box secondary-serif">
                <div className="sidebar-box-contents">
                    <img src="logo2.png"></img>
                    <img src="water_logo.png"></img>
                </div>
                <a href="https://coast.engr.uga.edu/">UGA Coast Website</a>
                <div id="version-container">
                    <b id="version-label">Version:</b>
                    <text id="version">Loading</text>
                </div>
                <hr></hr>
                <div>
                    <text id="tiff-name">Select a tiff to start</text>
                </div>
            </div>
            <div id="controls">
                <select id="tiff-1" className="closed-dropdown tiff-select"></select> 
                <select id="tiff-2" className="closed-dropdown tiff-select"></select>
                <select id="tiff-3" className="closed-dropdown tiff-select"></select>
                <select id="tiff-4" className="closed-dropdown tiff-select"></select>
                <select id="tiff-5" className="closed-dropdown tiff-select"></select>
            </div>
        </div>
    );
};

export default Sidebar;