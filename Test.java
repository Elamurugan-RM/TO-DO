
import org.openqa.selenium.Alert;
        import org.openqa.selenium.By;
        import org.openqa.selenium.WebDriver;
        import org.openqa.selenium.WebElement;
        import org.openqa.selenium.chrome.ChromeDriver;
        import org.openqa.selenium.chrome.ChromeOptions;
        import org.openqa.selenium.edge.EdgeDriver;
        import org.openqa.selenium.edge.EdgeOptions;
        import org.openqa.selenium.firefox.FirefoxDriver;
        import org.openqa.selenium.firefox.FirefoxOptions;
        import org.openqa.selenium.NoAlertPresentException;
        import org.openqa.selenium.support.ui.ExpectedConditions;
        import org.openqa.selenium.support.ui.WebDriverWait;

        import java.time.Duration;

public class Test2 {

    public static void test(WebDriver driver) {
        long startTime = System.currentTimeMillis();

        // Open the web page
        driver.get("file:///C:/Users/21i315/Downloads/TO-DO-TD-6-Notifications-and-Reminders/TO-DO-TD-6-Notifications-and-Reminders/index.html");

        // Perform actions
        try {
            // Add a task
            WebElement inputBox = driver.findElement(By.id("input-box"));
            inputBox.sendKeys("Sample Task");

            WebElement dueDate = driver.findElement(By.id("due-date"));
            dueDate.sendKeys("2024-07-20"); // Example due date (format: YYYY-MM-DD)

            WebElement addButton = driver.findElement(By.xpath("//button[contains(text(),'Add')]"));
            addButton.click();

            // Handle alert if it appears
            handleAlert(driver);

            // Wait for the task to be added
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement addedTask = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//li[contains(text(),'Sample Task')]")));

            // Check if task was added successfully
            if (addedTask.isDisplayed()) {
                System.out.println("Task added successfully.");
                System.out.println("Task Added to Database");
            } else {
                System.out.println("Failed to add task.");
            }

            // Add a unique identifier to the added task for easier deletion
            String addedTaskXPath = "//li[contains(text(),'Sample Task')]";
            WebElement addedTaskRemoveButton = addedTask.findElement(By.xpath(".//span[contains(@class, 'remove-task')]"));

            // Remove the task
            addedTaskRemoveButton.click();

            // Handle alert if it appears
            handleAlert(driver);

            // Wait for the task to be removed
            wait.until(ExpectedConditions.invisibilityOf(addedTask));

            // Check if task was removed successfully
            boolean taskRemoved = driver.findElements(By.xpath(addedTaskXPath)).isEmpty();
            if (taskRemoved) {
                System.out.println("Task removed successfully.");
                System.out.println("Task removed from Database");
            } else {
                System.out.println("Failed to remove task.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        // End measuring time
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;
        System.out.println("Total time taken: " + totalTime + " milliseconds");
        if (totalTime < 1000) {
            System.out.println("Performance Status: Good");
        } else if (totalTime < 3000) {
            System.out.println("Performance Status: Normal");
        } else {
            System.out.println("Performance Status: Poor");
        }
    }

    private static void handleAlert(WebDriver driver) {
        try {
            Alert alert = driver.switchTo().alert();
            System.out.println("Alert found with text: " + alert.getText());
            alert.accept(); // or alert.dismiss();
        } catch (NoAlertPresentException e) {
            // No alert found
        }
    }

    public static void main(String[] args) {
        // Set ChromeDriver path
        // System.setProperty("webdriver.chrome.driver", "path_to_chromedriver");

        // Chrome browser testing
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized"); // Maximize browser window

        // Initialize WebDriver
        WebDriver cdriver = new ChromeDriver(options);
        System.out.println("--------------Chrome Browser Testing Result------------");
        test(cdriver);

        // Edge Browser testing
        EdgeOptions options2 = new EdgeOptions();

        // Initialize WebDriver
        WebDriver edriver = new EdgeDriver(options2);
        System.out.println("--------------Edge Browser Testing Result------------");
        test(edriver);

        // Firefox Browser testing
        FirefoxOptions options3 = new FirefoxOptions();

        // Initialize WebDriver
        WebDriver fdriver = new FirefoxDriver(options3);
        System.out.println("--------------FireFox browser Testing Result------------");
        test(fdriver);
    }
}
