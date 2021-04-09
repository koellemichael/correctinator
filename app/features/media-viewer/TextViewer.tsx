import React from 'react';
import fs from 'fs';
import AceEditor from 'react-ace';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modelist from 'ace-builds/src-noconflict/ext-modelist';
import 'ace-builds/webpack-resolver';
import { remote } from 'electron';
import ViewerProps from './ViewerProps';

export default function TextViewer(props: ViewerProps) {
  const { filePath, scale } = props;
  const data = fs.readFileSync(filePath, 'UTF-8') + '\n'.repeat(6);
  const mode = Modelist.getModeForPath(filePath);

  return (
    <AutoSizer>
      {({ width, height }) => (
        <AceEditor
          fontSize={12 * scale}
          readOnly
          showPrintMargin={false}
          mode={mode.name}
          theme={
            remote.nativeTheme.shouldUseDarkColors ? 'twilight' : 'textmate'
          }
          width={`${width - 20}px`}
          maxLines={Infinity}
          style={{ minHeight: height }}
          value={data}
          wrapEnabled
          name="editor"
          editorProps={{ $blockScrolling: true }}
        />
      )}
    </AutoSizer>
  );
}
