import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../../store/actions/actionTypes";
import { Artist } from "react-spotify-api";
import { connect } from "react-redux";
import {
    Grid,
    Typography,
    Button,
    List,
    Avatar,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

class ArtistView extends Component {
    playSongHandler = track => {
        if (track) {
            let uris;
            if (track.type === "artist") {
                uris = JSON.stringify({
                    context_uri: track.uri
                });
            } else {
                // track.type === "track"
                uris = JSON.stringify({
                    context_uri: track.album.uri,
                    offset: {
                        uri: track.uri
                    }
                });
            }
            this.props.playSong(uris);
        }
    };

    render() {
        let ArtistHeader = (
            <Artist id={this.props.match.params.id}>
                {artist =>
                    artist ? (
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <div style={{ textAlign: "center" }}>
                                <Avatar
                                    src={artist.images[0].url}
                                    style={{
                                        margin: "0 auto",
                                        width: 300,
                                        height: 300,
                                        marginBottom: 10
                                    }}
                                />
                                <Typography variant="title">
                                    {artist.name}
                                </Typography>
                                <Button
                                    color="primary"
                                    onClick={() => this.playSongHandler(artist)}
                                >
                                    Play
                                </Button>
                            </div>
                        </Grid>
                    ) : (
                        <h1>Loading...</h1>
                    )
                }
            </Artist>
        );

        let ArtistTopTracksList = (
            <Artist.Tracks id={this.props.match.params.id}>
                {tracks =>
                    tracks ? (
                        <List style={{ width: "100%" }}>
                            {tracks.tracks.map(track => (
                                <ListItem key={track.id}>
                                    <ListItemIcon style={{ cursor: "pointer" }}>
                                        {this.props.currentlyPlaying ===
                                            track.name &&
                                        this.props.isPlaying ? (
                                            <PauseIcon
                                                onClick={this.props.pauseSong}
                                            />
                                        ) : (
                                            <PlayArrowIcon
                                                onClick={() =>
                                                    this.playSongHandler(track)
                                                }
                                            />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={track.name}
                                        secondary={track.album.name}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <h1>Loading...</h1>
                    )
                }
            </Artist.Tracks>
        );
        return (
            <Grid container>
                {ArtistHeader}
                {ArtistTopTracksList}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.current_user,
        currentlyPlaying: state.currently_playing,
        isPlaying: state.isPlaying
    };
};

const mapDispatchToProps = dispatch => {
    return {
        playSong: uris => dispatch(actionTypes.playSong(uris)),
        pauseSong: () => dispatch(actionTypes.pauseSong())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ArtistView)
);
