package com.koellemichael.utils;

import com.koellemichael.model.Correction;
import javafx.collections.ObservableList;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileUtils {

    public static void listFiles(String directoryName, ArrayList<File> files, FileFilter fileFilter, FileFilter dirFilter) {
        File directory = new File(directoryName);
        File[] fList = directory.listFiles(dirFilter);

        if(fList != null){
            List<File> allFiles = Arrays.stream(fList).filter(f -> !f.isDirectory()).filter(fileFilter::accept).collect(Collectors.toList());
            files.addAll(allFiles);
        }

        if(fList != null) {
            for (File file : fList) {
                if (file.isDirectory()) {
                    listFiles(file.getAbsolutePath(), files, fileFilter, dirFilter);
                }
            }
        }
    }

    public static void exportAsZip(File file, File correctionsDirectory){
        try {
            if(correctionsDirectory != null){
                File[] directoriesToZip = correctionsDirectory.listFiles();
                if(directoriesToZip != null){
                    List<String> directoryPathsToZip = Arrays.stream(directoriesToZip).map((File::getAbsolutePath)).collect(Collectors.toList());
                    FileOutputStream fos = new FileOutputStream(file);
                    ZipOutputStream zipOut = new ZipOutputStream(fos);

                    for (String path:directoryPathsToZip) {
                        File fileToZip = new File(path);
                        zipFile(fileToZip, fileToZip.getName(), zipOut);
                    }

                    zipOut.close();
                    fos.close();
                    System.out.println("Saved ZIP to: " + file.getAbsolutePath());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void zipFile(File fileToZip, String fileName, ZipOutputStream zipOut) throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zipOut.putNextEntry(new ZipEntry(fileName));
                zipOut.closeEntry();
            } else {
                zipOut.putNextEntry(new ZipEntry(fileName + "/"));
                zipOut.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + "/" + childFile.getName(), zipOut);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOut.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }
        fis.close();
    }

    public static void exportAsZipWithFileChooser(File dirToZip, File initialFileDirectory, String initialFileName, Stage stage){
        FileChooser choose = new FileChooser();
        choose.setTitle("Abgaben als Zip speichern");
        choose.getExtensionFilters().add(new FileChooser.ExtensionFilter("Zip Datei(*.zip)", "*.zip"));

        choose.setInitialDirectory(initialFileDirectory);
        choose.setInitialFileName(initialFileName);

        /*
        if(correctionsDirectory!=null){
            choose.setInitialDirectory(correctionsDirectory.getParentFile());
            if(corrections != null && corrections.get(0) != null){
                choose.setInitialFileName(("Korrektur_" + corrections.get(0).getLecture() + "_" + corrections.get(0).getExerciseSheet()).replace(" ", "_"));
            }else{
                choose.setInitialFileName(correctionsDirectory.getName());
            }
        }

         */

        File f = choose.showSaveDialog(stage);

        if(f != null){
            if(!f.getName().contains(".")) {
                f = new File(f.getAbsolutePath() + ".zip");
            }

            f.delete();
            FileUtils.exportAsZip(f,dirToZip);
        }
    }

}
