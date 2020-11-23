/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-cycle */
import {
  Backdrop,
  Box,
  Button,
  Container,
  Fab,
  Grid,
  Hidden,
  Icon,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ErrorIcon from '@material-ui/icons/Error';
import CropFreeIcon from '@material-ui/icons/CropFree';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useEffect, useState } from 'react';
import { shell } from 'electron';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import mime from 'mime-types';
import fs from 'fs';
import PDFViewer from './PDFViewer';
import clamp from '../../utils/MathUtil';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';

export default function MediaViewer(props: any) {
  const [fileIndex, setFileIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const { files = [] } = props;

  useEffect(() => setFileIndex(0), [files]);

  const ZOOMSTEP = 20 / 100;
  const ZOOMMIN = 40 / 100;
  const ZOOMMAX = 500 / 100;

  function resetScaleAndRotation() {
    setRotation(0);
    setScale(1);
  }

  function onResetScale() {
    setScale(1);
  }

  function onOpenFolder() {
    shell.showItemInFolder(files[fileIndex]);
  }

  function onZoomIn() {
    setScale(clamp(scale + ZOOMSTEP, ZOOMMIN, ZOOMMAX));
  }

  function onZoomOut() {
    setScale(clamp(scale - ZOOMSTEP, ZOOMMIN, ZOOMMAX));
  }

  function onRotateLeft() {
    setRotation((rotation - 90) % 360);
  }

  function onRotateRight() {
    setRotation((rotation + 90) % 360);
  }

  function onNextFile() {
    resetScaleAndRotation();
    setFileIndex(Math.abs((fileIndex + 1) % files.length));
  }

  function onPreviousFile() {
    resetScaleAndRotation();
    setFileIndex(Math.abs((fileIndex + (files.length - 1)) % files.length));
  }

  if (files.length === 0 || !fs.existsSync(files[fileIndex])) {
    return (
      <Box height="100%">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Grid item>
            <ErrorIcon />
          </Grid>
          <Grid item>
            <Typography>File not found!</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }
  const type = mime.lookup(files[fileIndex]);
  let viewer;

  switch (true) {
    case type === 'application/pdf':
      viewer = (
        <PDFViewer file={files[fileIndex]} scale={scale} rotation={rotation} />
      );
      break;
    case /image\/.+/.test(type):
      viewer = (
        <ImageViewer
          file={files[fileIndex]}
          scale={scale}
          rotation={rotation}
        />
      );
      break;
    default:
      viewer = (
        <TextViewer file={files[fileIndex]} scale={scale} rotation={rotation} />
      );
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          margin: '0 0 0 10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {viewer}
      </div>
      <Grid
        container
        style={{ position: 'absolute', bottom: '20px' }}
        justify="center"
        alignItems="center"
      >
        <Paper>
          <Grid item container justify="center" alignItems="center">
            <Grid item>
              <Tooltip title="Previous file">
                <IconButton
                  size="medium"
                  aria-label="add"
                  onClick={onPreviousFile}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Rotate left">
                <IconButton
                  size="medium"
                  aria-label="add"
                  onClick={onRotateLeft}
                >
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Zoom in">
                <IconButton size="medium" aria-label="add" onClick={onZoomIn}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                ({fileIndex + 1}/{files.length})
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Zoom out">
                <IconButton size="medium" aria-label="add" onClick={onZoomOut}>
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Rotate right">
                <IconButton
                  size="medium"
                  aria-label="add"
                  onClick={onRotateRight}
                >
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Next file">
                <IconButton size="medium" aria-label="add" onClick={onNextFile}>
                  <NavigateNextIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Reset scale">
                <IconButton
                  size="medium"
                  aria-label="add"
                  onClick={onResetScale}
                >
                  <CropFreeIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Open file in folder">
                <IconButton
                  size="medium"
                  aria-label="add"
                  onClick={onOpenFolder}
                >
                  <FolderOpenIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}
