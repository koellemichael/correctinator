package com.koellemichael;

import com.koellemichael.controller.Controller;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Rectangle2D;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Screen;
import javafx.stage.Stage;

public class App extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception{
        /*
        MavenXpp3Reader reader = new MavenXpp3Reader();
        Model model;
        if ((new File("pom.xml")).exists())
            model = reader.read(new FileReader("pom.xml"));
        else
            model = reader.read(
                    new InputStreamReader(
                            Application.class.getResourceAsStream(
                                    "/META-INF/maven/de.scrum-master.stackoverflow/aspectj-introduce-method/pom.xml"
                            )
                    )
            );
        */
        Rectangle2D primaryScreenBounds = Screen.getPrimary().getVisualBounds();
        double width = primaryScreenBounds.getWidth() / 1.2;
        double height = primaryScreenBounds.getHeight() / 1.2;

        FXMLLoader loader = new FXMLLoader(getClass().getResource("/layout/main.fxml"));
        Parent root = loader.load();
        Controller controller = loader.getController();
        controller.initialize(primaryStage);

        primaryStage.setTitle("Correctinator");
        primaryStage.setFullScreenExitHint("F1 um Vollbild zu verlassen");
        primaryStage.setScene(new Scene(root, width, height));
        primaryStage.show();
    }


    public static void main(String[] args) {
        launch(args);
    }
}