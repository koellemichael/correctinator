package com.koellemichael.controller;

import com.koellemichael.utils.DesktopApi;
import com.koellemichael.utils.FileUtils;
import com.koellemichael.utils.PreferenceKeys;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import org.mozilla.universalchardet.UniversalDetector;

import javax.swing.text.BadLocationException;
import javax.swing.text.Document;
import javax.swing.text.rtf.RTFEditorKit;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.prefs.Preferences;

public class MediaViewController {
    public StackPane p_media;
    public Label lbl_current_file_max;
    public Label lbl_current_file;
    private int allFilesPos;
    private ArrayList<File> files;
    private Preferences preferences;

    public void initialize(ArrayList<File> files){
        this.files = files;
        this.allFilesPos = 0;
        this.preferences = Preferences.userRoot();

        if(this.files != null){
            this.lbl_current_file_max.setText(String.valueOf(this.files.size()));
        }else{
            this.lbl_current_file_max.setText("0");
        }

        //Show first file
        if(this.files != null && this.files.size()>0){
            openMediaFile(this.files.get(allFilesPos));
            lbl_current_file.setText(String.valueOf(allFilesPos+1));
        }

    }

    public void onOpenCurrentDirectory(ActionEvent actionEvent) {
        if(files == null){
            return;
        }
        DesktopApi.browse(files.get(allFilesPos).getParentFile().toURI());
    }

    public void onFilePrev(ActionEvent actionEvent) {
        if(files == null){
            return;
        }
        int temp = allFilesPos - 1;
        if(temp>=0){
            allFilesPos--;
            openMediaFile(files.get(allFilesPos));
            lbl_current_file.setText(String.valueOf(allFilesPos+1));
        }else{
            if(preferences.getBoolean(PreferenceKeys.CYCLE_FILES_PREF,false)){
                allFilesPos = files.size()-1;
                openMediaFile(files.get(allFilesPos));
                lbl_current_file.setText(String.valueOf(allFilesPos+1));
            }
        }
    }

    public void onFileNext(ActionEvent actionEvent) {
        if(files == null){
            return;
        }
        int temp = allFilesPos + 1;
        if(temp<=files.size()-1){
            allFilesPos++;
            openMediaFile(files.get(allFilesPos));
            lbl_current_file.setText(String.valueOf(allFilesPos+1));
        }else{
            if(preferences.getBoolean(PreferenceKeys.CYCLE_FILES_PREF,false)){
                allFilesPos = 0;
                openMediaFile(files.get(allFilesPos));
                lbl_current_file.setText(String.valueOf(allFilesPos+1));
            }
        }
    }

    private void openMediaFile(File file){
        if(file == null){
            return;
        }
        p_media.getChildren().clear();
        try {
            String mimeType = Files.probeContentType(Paths.get(file.toURI()));
            if(mimeType == null){
                return;
            }
            switch (mimeType){
                case "application/pdf": openPDF(file); break;
                case "image/bmp":
                case "image/gif":
                case "image/jpeg":
                case "image/png":
                case "image/svg+xml":
                case "image/tiff": openImage(file); break;
                case "text/rtf":
                case "text/css":
                case "text/html":
                case "text/javascript":
                case "text/plain":
                case "text/richtext":
                case "text/tab-separated-values":
                case "text/comma-separated-values":
                case "text/xml":
                default: openText(file,mimeType);
            }
        } catch (IOException ignored) {}
    }

    private void openPDF(File file) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/layout/pdfview.fxml"));
            Pane p = loader.load();
            PDFViewController controller = loader.getController();
            controller.initialize(file);
            p_media.getChildren().add(p);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    private void openText(File file, String mimeType) {
        try {

            FXMLLoader loader = new FXMLLoader(getClass().getResource("/layout/textview.fxml"));
            Pane p = loader.load();
            TextViewController controller = loader.getController();

            //Determine Encoding
            String encoding = UniversalDetector.detectCharset(file);
            if(encoding == null){
                encoding = Charset.defaultCharset().toString();
            }

            //Converting File to String
            String contents;
            if(mimeType.equals("text/rtf")){
                RTFEditorKit rtfParser = new RTFEditorKit();
                Document document = rtfParser.createDefaultDocument();
                rtfParser.read(new ByteArrayInputStream(Files.readAllBytes(file.toPath())), document, 0);
                String text = document.getText(0, document.getLength());
                contents = new String(text.getBytes(encoding));
            }else{
                contents = FileUtils.readStringFromFile(file, encoding);
            }


            controller.initialize(contents,mimeType);
            p_media.getChildren().add(p);
        } catch (IOException | BadLocationException ex) {
            ex.printStackTrace();
        }
    }

    private void openImage(File file) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/layout/imageview.fxml"));
            Pane p = loader.load();
            ImageViewController controller = loader.getController();
            controller.initialize(new Image(file.toURI().toURL().toString()));
            p_media.getChildren().add(p);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    private String getFileExtension(File file) {
        String name = file.getName();
        int lastIndexOf = name.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return ""; // empty extension
        }
        return name.substring(lastIndexOf);
    }

    public void onReloadFile(ActionEvent actionEvent) {
        if(files == null){
            return;
        }
        openMediaFile(files.get(allFilesPos));
    }
}