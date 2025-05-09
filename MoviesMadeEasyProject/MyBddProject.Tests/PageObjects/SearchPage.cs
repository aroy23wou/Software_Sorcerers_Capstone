using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace MyBddProject.PageObjects
{
    public class SearchPage
    {
        private readonly IWebDriver _driver;

        public SearchPage(IWebDriver driver)
        {
            _driver = driver;
        }

        public void EnterSearchTerm(string term)
        {
            var searchInput = _driver.FindElement(By.Id("searchInput"));
            searchInput.Clear();
            searchInput.SendKeys(term);
        }

        public void SubmitSearch()
        {
            _driver.FindElement(By.Id("searchInput")).SendKeys(Keys.Return);
        }

        public void ClickMoreLikeThis(int resultIndex = 0)
        {
            var buttons = _driver.FindElements(By.CssSelector(".btn-outline-secondary"));
            buttons[resultIndex].Click();
        }
        public bool ResultsContain(string expectedText)
        {
            try 
            {
                var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15)); // Increased timeout
                
                // First wait for either results or a "no results" message
                wait.Until(d => 
                    d.FindElements(By.CssSelector(".movie-card")).Count > 0 ||
                    d.FindElements(By.CssSelector(".no-results")).Count > 0);
                
                // Check if we got a "no results" message
                if (_driver.FindElements(By.CssSelector(".no-results")).Count > 0)
                    return false;
                    
                // Then check if any card contains the expected text
                var cards = _driver.FindElements(By.CssSelector(".movie-card"));
                return cards.Any(card => card.Text.Contains(expectedText));
            }
            catch (WebDriverException)
            {
                return false;
            }
        }
        public bool IsSearchInputDisplayed()
        {
            try
            {
                return _driver.FindElement(By.Id("searchInput")).Displayed;
            }
            catch
            {
                return false;
            }
        }
    }
}