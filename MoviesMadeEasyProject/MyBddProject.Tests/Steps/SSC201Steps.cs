using Reqnroll;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using NUnit.Framework;
using MyBddProject.PageObjects;
using System;
using System.Threading;

namespace MyBddProject.Tests.Steps
{
    [Binding]
    public class StreamingServiceSteps
    {
        private readonly IWebDriver _driver;
        private readonly SearchPage _searchPage;
        private readonly ModalPage _modalPage;
        private readonly TimeSpan _defaultTimeout = TimeSpan.FromSeconds(30);

        public StreamingServiceSteps(IWebDriver driver)
        {
            _driver = driver;
            _searchPage = new SearchPage(driver);
            _modalPage = new ModalPage(driver);
        }

        [AfterScenario]
        public void AfterScenario()
        {
            try 
            {
                // Close all windows except the main one
                while (_driver.WindowHandles.Count > 1)
                {
                    _driver.SwitchTo().Window(_driver.WindowHandles.Last());
                    _driver.Close();
                }
                
                // Switch back to main window
                if (_driver.WindowHandles.Count > 0)
                {
                    _driver.SwitchTo().Window(_driver.WindowHandles.First());
                }
            }
            catch (Exception) { /* Ignore cleanup errors */ }
        }


        // Modify the GivenTheUserIsOnTheSearchPage method
        [Given(@"the user is on the search page for icons test")]
        public void GivenTheUserIsOnTheSearchPage()
        {
            try 
            {
                // Navigate to the root URL if not already there
                if (!_driver.Url.Contains("localhost:5000"))
                {
                    _driver.Navigate().GoToUrl("http://localhost:5000/");
                    
                    // Wait for page to load
                    var wait = new WebDriverWait(_driver, _defaultTimeout);
                    wait.Until(d => _searchPage.IsSearchInputDisplayed());
                }
                
                // Verify the page is ready
                Assert.IsTrue(_searchPage.IsSearchInputDisplayed(), "Search input should be displayed");
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to load search page: {ex.Message}");
            }
        }

        [When(@"the user enters ""(.*)"" into the search bar")]
        public void WhenTheUserEntersInTheSearchBar(string searchTerm)
        {
            _searchPage.EnterSearchTerm(searchTerm);
            _searchPage.SubmitSearch();
        }

        [Then(@"the search should show results for ""(.*)""")]
        public void ThenTheUserSearchShouldShowResultsFor(string expectedResult)
        {
            Assert.IsTrue(_searchPage.ResultsContain(expectedResult));
        }

        [Given(@"the user has searched for the ""(.*)"" movie")]
        public void GivenTheUserHasSearchedFor201(string searchTerm)
        {
            GivenTheUserIsOnTheSearchPage();
            WhenTheUserEntersInTheSearchBar(searchTerm);
            ThenTheUserSearchShouldShowResultsFor(searchTerm);
        }

        [When(@"the user clicks View Details on the first result")]
        public void WhenTheUserClicksTheViewDetailsButtonOnTheFirstResult()
        {
            _searchPage.ClickViewDetails();
            _modalPage.WaitForModalToLoad();
        }

        [Then(@"the user should see the view details modal pop up")]
        public void ThenTheUserShouldSeeTheDetailsModalPopUp()
        {
            Assert.IsTrue(_modalPage.IsModalDisplayed(), "Modal should be displayed");
            Assert.IsTrue(_modalPage.IsModalTitleDisplayed(), "Modal title should be displayed");
        }

        [Given(@"the user has clicked the View Details button from search results")]
        public void GivenTheUserHasClickedTheViewDetailsButtonFromSearch()
        {
            GivenTheUserHasSearchedFor201("Hunger Games");
            WhenTheUserClicksTheViewDetailsButtonOnTheFirstResult();
        }

        [When(@"the user is on the modal pop up")]
        public void WhenTheUserIsOnTheModalPopUp()
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
            wait.Until(d => _modalPage.IsModalDisplayed());
        }

        [Then(@"the user should see the Apple TV, Netflix, and Prime Video icons")]
        public void ThenTheUserShouldSeeTheAppleTVNetflixAndPrimeVideoIcons()
        {
            Assert.IsTrue(_modalPage.IsStreamingIconDisplayed("Apple TV"), "Apple TV icon should be displayed");
            Assert.IsTrue(_modalPage.IsStreamingIconDisplayed("Netflix"), "Netflix icon should be displayed");
            Assert.IsTrue(_modalPage.IsStreamingIconDisplayed("Prime Video"), "Prime Video icon should be displayed");
        }

        // [When(@"the user clicks the (.*) icon")]
        // public void WhenTheUserClicksTheServiceIcon(string serviceName)
        // {
        //     _modalPage.ClickStreamingIcon(serviceName);
        // }

        // [Then(@"the user should be redirected to the (.*) login page")]
        // public void ThenTheUserShouldBeRedirectedToTheServiceLoginPage(string serviceName)
        // {
        //     var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
        //     wait.Until(d => d.Url.ToLower().Contains(serviceName.ToLower().Replace(" ", "")));
        //     Assert.IsTrue(_driver.Url.ToLower().Contains(serviceName.ToLower().Replace(" ", "")), 
        //         $"Should be redirected to {serviceName} login page");
        // }
    }
}