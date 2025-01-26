# Requirements Workup

## Elicitation

1. **Is the goal or outcome well defined?  Does it make sense?**
    - **Goal/Outcome:** Users want a website where they can enter the title of a movie or TV show, and the site will retrieve up-to-date streaming availability (e.g., Netflix, Amazon Prime, Hulu, Disney+, etc.) vis and external API
    - **Does it make sense?** Yes. Users often want a quick way to figure out where they can watch a particular movie or show without manually checking multiple streaming platforms.
2. **What is not clear from the given description?**
    - How comprehensive is the API? Does it include global streaming services or just North America?
    - Will the site require user accounts (e.g., to save favorite shows or watchlists)?
    - Do we support advanced filtering (e.g., by genre, country, language)?
3. **How about scope?  Is it clear what is included and what isn't?**
    - **Included:** 
        - Core functionality to search by title, display availability results.
        - Possibly store minimal data bout shows in local DB for quick lookups.
        - Integrating with an external API that provides availability data.
    - **Excluded (for first iteration):**
        - Detailed user profiles.
        - Watchlists.
        - Recomendations.
4. **What do you not understand?**
    - **Technical domain knowledge**
        - We need details on how to interface with the external API (Authentication, rate limits, JSON structure, etc.)
    - **Business domain knowledge**
        - Are there any legal consideration around streaming data usage or disclaimers needed?
5. **Is there something missing?**
    - Might need to plan for how often we want to refresh the external API or if we want to cashe the data.
    - Need error handling for titles not found or services that don't respond.
    - Do we want to handle multiple regions or just one region?
6. **Get answers to these questions.**
    - We should consult the API documentation to confirm request/response structures, authentication methods, rate limits.
    - We should clarify if user accounts and advanced personalization is in scope.
    - We should confirm if we want to support multiple regions or just a single country initially.

## Analysis

Go through all the information gathered during the previous round of elicitation.  

1. **For each attribute, term, entity, relationship, activity ... precisely determine its bounds, limitations, types and constraints in both form and function.  Write them down.**
    - **Movie/TV shows**
        - *Attributes:* title, release year, type (movie or TV show), possibly IDs (e.g. IMDB, TMDb).
        - *Constraints:* The search will rely heavily on matching titles from the API. Spelling or partial matches might require extra logic.
    - **Streaming services**
        - *Attributes:* Name (Netflix, Amazon, etc.), region (US, CA, etc.)
        - *Constraints:* First iteration might only track simple list of known streaming services.
    - **Availability**  
        - *Attributes*: a mapping of {title → list of streaming services}.  
        - *Constraints*: Provided by the external API; we might store or cache it locally for performance, subject to the API’s rate-limits or caching rules.  
    - **Search**  
        - *Activities*: user enters a title, the system queries the external API and returns results.  
        - *Constraints*: Must handle titles not found, partial titles, or multiple matches.
    - **User**
        - *Attributes:* username (email), password (hashed), watchlist or favorites.
        - *Constraints:* Not strictly necessary for purely public search, but might be introduced if we want to save favorites or add recomendations.
2. **Do they work together or are there some conflicting requirements, specifications or behaviors?**
    - The biggest conflict is between the user's desire for real-time results and the API's rate limits. We may need a cashing mechanism to reduce direct calls.
3. **Have you discovered if something is missing?**
    - We might need an entity for search results or caching table that stores the last known availability for each requested title.
    - If we do implement user accounts, we'll also need to handle user data privacy.
4. **Return to Elicitation activities if unanswered questions remain.**


## Design and Modeling
Our first goal is to create a **data model** that will support the initial requirements.

1. Identify all entities;  for each entity, label its attributes; include concrete types
    - **Title**
        - `id` (primary key, integer or UUID)
        - `external_id` (string; references external service/IMDB/TMDb ID)
        - `title_name` (string)
        - `year` (integer)
        - `type` (string: "movie" or "tv")
        - `last_updated` (datetime; track when info was last fetched)
    - **StreamingService**  
        - `id` (primary key, integer or UUID)  
        - `name` (string)  
        - `region` (string, optional, e.g., “US,” “Global,” etc.)
    - **Availability** (many-to-many relationship between Title and StreamingService)  
        - `id` (primary key, integer or UUID)  
        - `title_id` (references Title)  
        - `streaming_service_id` (references StreamingService)  
        - `last_checked` (datetime)  
        - `link` (string or text; URL to the service’s page for the title)  
        - `availability_status` (string or boolean; whether it’s currently available)
    - **User**  
        - `user_id` (primary key, integer or UUID)  
        - `email` (string, unique)  
        - `hashed_password` (string)
2. Identify relationships between entities.  Write them out in English descriptions.
    - A **Title** can be associated with many **StreamingServices** through an **Availability** link.  
    - A **StreamingService** can have many **Titles** available, again linked via **Availability**.  
    - A **User** can perform multiple searches but is not directly linked to the titles unless we add a “favorites” or “watchlist” table.
3. Draw these entities and relationships in an _informal_ Entity-Relation Diagram.

```
Title (title_id)
   |         \
   | (has)    \
   v           v
 Availability (id) <---> StreamingService (id)

 (Optional)
 User (user_id
```
- The `Title` entity links to the `StreamingService` entity through a join table `Availability`.  
- Each row in `Availability` tells us whether a given title is on a particular streaming service and provides a link or status.

4. If you have questions about something, return to elicitation and analysis before returning here.

## Analysis of the Design
The next step is to determine how well this design meets the requirements _and_ fits into the existing system.

1. **Does the design support all requirements/features/behaviors?**  
   - **Search**: The user searches by a title name; the system either:  
        1. Checks if it has a cached entry in `Title` (with up-to-date `Availability` rows).  
        2. If not recent enough, it calls the external API.  
        3. Stores or updates local data in `Title` and `Availability`.  
        4. Returns a list of streaming services from `Availability`.  
   - **Real-time or near-real-time results**: We can leverage `last_updated` and `last_checked` columns for caching logic.  
   - **Handling multiple streaming platforms**: The many-to-many relationship in `Availability` supports multiple services for each title.  
   - **user features**: The design can be expanded to include user watchlists in a separate table (e.g., `UserFavorites` referencing `User` and `Title`).

2. **Does it meet all non-functional requirements?**  
    - **Performance**: The caching approach (storing results in a local DB) will minimize repeated calls to the external API. Database indexing on `title_name` can help with efficient searching.  
    - **Scalability**: As traffic grows, the main scaling concern is the rate limit on the external API. Using a caching strategy with queued or scheduled updates can help.  
    - **Security**: We only store basic info about titles. If user accounts are introduced, we must secure user credentials with hashed passwords and follow best practices (TLS/HTTPS).  
    - **Maintainability**: A straightforward relational model. If we need expansions later (e.g., multi-region, user favorites), we can add or modify tables without huge disruption.
    - **Accessability features** We need to keep Accessability in mind when creating new features.

