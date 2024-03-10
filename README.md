# Race Submissions
#### Video Demo:  <URL HERE> TODO
#### Description:
https://cs50.harvard.edu/x/2023/project/

This website is truly an uninspired, unimaginative, and unoriginal idea. It’s intended function is to provide a platform for people to submit and view their and other users' submissions from various racing games so that they can compare. Features include; user sessions, searching submissions, submitting new submissions, a basic profile page with the user’s display name, profile picture, and submission aggregated information, and updating the user’s information. The project was executed by developing a web-based application using HTML, JavaScript, Flask, and SQLite3. 

Truthfully, I am of the opinion that I am not a very creative person, an ideas man, or an innovator. My mind feels more like a clogged catalytic converter than an engine. Since it was a struggle to even conjure a single original thought, I settled on the web-based application to save and display racing game records submitted by it’s users due to, at the time, I had bought a racing wheel, pedals, and shifter to enjoy the experience of driving a virtual car instead of owning one.

The skills that may or may not have been improved, assuming that I even had a minuscule amount of understanding to begin with, are JavaScript and applying the method of Asynchronous JavaScript and XML, AJAX, on some sections of the web pages in an attempt to minimize the number of times the page reloads. At least I put some time behind the wheel, even if it was only mere minutes or a few hours each day. This project definitely took longer than it should have considering the scope of it.

#### Install instructions
1. Ensure you have VScode installed.
2. Ensure you have Flask installed.
3. **git clone https://github.com/JonathanC13/CS50ProjRaceSubmissions.git**
4. If starting fresh database, delete raceSubmissions.db and then see Folder **/sqlFolder/sql_init_tables.sql**
5. Delete Folder **/flask_session**
6. run command: **Flask run**
   - If missing modules:
        - Install them one by one as errors occur, i.e.:
        - pip/pip3 install pillow
        - pip/pip3 install cs50
        - pip/pip3 install flask_session
        - pip/pip3 install pytz
        - pip/pip3 install requests
7. Finally, with all modules installed, run: **Flask run** again
8. Hopefully the server will start and you will be able to see the web page: 
    - e.g. * Running on http://127.0.0.1:5000

#### Files' purposes
##### Folder /Root
###### app.py
Flask as the backend to render html pages, handle GET and POST requests, and to interface with the SQLite3 database.

###### functions.py
General functions.

###### raceSubmissions.db
My raceSubmissions database, this can be deleted and start anew by viewing ./sqlFolder/sql_init_tables.sql

###### testCases.txt
Contains the test cases conducted on the web pages.

##### Folder /sqlFolder
###### sql_init_tables.sql
Contains the instructions to create the database and tables while also populating the tables with initial data.

##### Folder /templates
###### layout.html
Base template that is common across all the web pages. It contains the external references and the top navbar.

###### home.html
This template contains a section for the search parameter container and a div reserved for the submission section awaiting to be populated.

###### login.html
This template contains the elements for log in.
- Input field: Username
- Input field: Password
- Button: Log In

###### profile.html
This template contains a section for the profile's information and statistics and a div reserved for the user's submission section.
- Profile section;
    - Image: Profile's picture
    - Span: Profile's display name
    - Span: Number of submissions
    - Span: Most submitted game
    - Span: Most submitted track
    - Span: Most submitted vehicle
    - Span: Most submitted game mode

###### register.html
This template contains the elements for registering a user.
- Input field: Display name
- Input field: Username
- Input field: Password
- Input field: Password (again)
- Button: Register

###### submit.html
This template contains the elements for submitting a record into the system.
- Input field: Game
- Input field: Platform
- Input field: Vehicle
- Input field: YT Embedded URL
- Input field: Track
- Input field: Game mode
- Input field: Full time HH
- Input field: Full time MM
- Input field: Full time SS
- Input field: Full time sss
- Input field: Best lap time HH
- Input field: Best lap time MM
- Input field: Best lap time SS
- Input field: Best lap time sss
- Text area: Description
- Button: Submit

###### user_settings.html
This template contains the elements for updating the profile's information.
- Image: Profile's picture
- Input field: For image file for new image
- Button: Update profile picture
- Input field: Profile's display name
- Button: Update display name
- Input field: Current Password
- Input field: New Password
- Input field: Confirm new Password
- Button: Update password

##### Folder /static
###### js.js
JavaScript file that handles the initialized event listeners and manipulates the DOM.

###### style.css
CSS file to apply styling to the web pages.

###### Folder /images
Contains images used for the web pages.

###### Folder /userProfilePics
Contains images used for users' profile pictures.
