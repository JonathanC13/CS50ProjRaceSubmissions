import os
import time
import decimal
import json

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from functions import *

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///raceSubmissions.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    """Home page: show the latest race submissions"""
    return render_template("home.html", page_type="home")

@app.route("/blankTest")
def blankTest():
    return render_template("blankTest.html")


@app.route("/nav_index_JS", methods=["POST"])
def nav_index_JS():
    return jsonify({'redirect': url_for("index")})


@app.route("/nav_search")
def nav_search():
    return render_template("home.html", page_type="search")


@app.route("/nav_search_JS", methods=["POST"])
def nav_search_JS():
    return jsonify({'redirect': url_for("nav_search")})


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    return render_template("profile.html", page_type="profile")


@app.route("/nav_profile_JS", methods=["POST"])
def nav_profile_JS():
    return jsonify({'redirect': url_for("profile")})


@app.route("/submit")
@login_required
def submit():
    return render_template("submit.html", page_type="submit")


@app.route("/nav_submit_JS", methods=["POST"])
def nav_submit_JS():
    return jsonify({'redirect': url_for("submit")})


@app.route("/user_settings")
@login_required
def user_settings():
    return render_template("user_settings.html", page_type="settings")


@app.route("/nav_user_settings_JS", methods=["POST"])
def nav_user_settings_JS():
    return jsonify({'redirect': url_for("user_settings")})


@app.route("/getSessionUserId", methods=["POST"])
def getSessionUserId():
    if request.method == "POST":
        if session.get('user_id') is not None:
            return jsonify({"user_id":session["user_id"]})
        
    return jsonify({"user_id":""})
    


@app.route("/populate_submissions_search", methods=["GET", "POST"])
def populate_submissions_search():

    sql_query = None
    mode = None
    
    if request.method == "POST":

        data = json.loads(request.form.get("search_json"))
        mode = data["mode"]
        
        if (mode == "search" or mode == "search_from_sub"):

            searchDict = {}

            searchDict["strGameName"] = str(data["strGameName"]).upper()
            searchDict["strPlatformName"] = str(data["strPlatformName"]).upper()
            searchDict["strDisplayName"] = str(data["strDisplayName"]).upper()
            searchDict["strVehicleName"] = str(data["strVehicleName"]).upper()
            searchDict["strTrackName"] = str(data["strTrackName"]).upper()
            searchDict["strGameModeName"] = str(data["strGameModeName"]).upper()
                
            params = []

            count = 0

            """select *, (SELECT COUNT() + 1 FROM tblSubmissions AS t WHERE iGameID = tblSubmissions.iGameID AND iTrackID = tblSubmissions.iTrackID AND iGameModeID = tblSubmissions.iGameModeID AND strFullTime < tblSubmissions.strFullTime) FROM tblSubmissions;"""
            """SELECT
                Name,
                Milliseconds,
                AlbumId,
                RANK () OVER ( 
                    PARTITION BY AlbumId
                    ORDER BY Milliseconds DESC
                ) LengthRank 
            FROM
                tracks;
            """

            sql_query = """SELECT *, datetime(strSubmittedDate, 'unixepoch', 'localtime') as 'strSubmittedDateFormatted',
                            RANK () OVER ( 
                                PARTITION BY a.iGameID, a.iTrackID, a.iGameModeID
                                ORDER BY strFullTime ASC
                            ) strStanding
                        FROM tblSubmissions a
                            INNER JOIN tblGames b ON b.iGameID = a.iGameID
                            INNER JOIN tblPlatforms c ON c.iPlatformID = a.iPlatformID
                            INNER JOIN tblVehicles d ON d.iVehicleID = a.iVehicleID
                            INNER JOIN tblTracks e ON e.iTrackID = a.iTrackID
                            INNER JOIN tblGameMode f ON f.iGameModeID = a.iGameModeID
                            INNER JOIN tblUsers g ON g.iUserID = a.iUserID"""
            
            for key, val in searchDict.items():
                if (val != ""):
                    params.append(val)

                    if (count == 0):
                        # first query condition
                        sql_query = sql_query + " WHERE"
                    else:
                        sql_query = sql_query + " AND"

                    sql_query = sql_query + " UPPER(" + key + ") = ?"

                    count += 1

            sql_query = sql_query + " ORDER BY a.strSubmittedDate DESC;"                       
            
        elif (mode == "profile"):
            sql_query = """SELECT *, datetime(strSubmittedDate, 'unixepoch', 'localtime') as 'strSubmittedDateFormatted',
                            RANK () OVER ( 
                                PARTITION BY a.iGameID, a.iTrackID, a.iGameModeID
                                ORDER BY strFullTime ASC
                            ) strStanding
                        FROM tblSubmissions a
                            INNER JOIN tblGames b ON b.iGameID = a.iGameID
                            INNER JOIN tblPlatforms c ON c.iPlatformID = a.iPlatformID
                            INNER JOIN tblVehicles d ON d.iVehicleID = a.iVehicleID
                            INNER JOIN tblTracks e ON e.iTrackID = a.iTrackID
                            INNER JOIN tblGameMode f ON f.iGameModeID = a.iGameModeID
                            INNER JOIN tblUsers g ON g.iUserID = a.iUserID
                        WHERE g.iUserID = ?
                        ORDER BY a.strSubmittedDate DESC;"""
        # else: select top 10 most recent
            
    
    # 
    #print("sql: " + str(sql_query))
    if (sql_query == None):
        sql_query = """SELECT *, datetime(strSubmittedDate, 'unixepoch', 'localtime') as 'strSubmittedDateFormatted',
                            RANK () OVER ( 
                                PARTITION BY a.iGameID, a.iTrackID, a.iGameModeID
                                ORDER BY strFullTime ASC
                            ) strStanding
                        FROM tblSubmissions a
                            INNER JOIN tblGames b ON b.iGameID = a.iGameID
                            INNER JOIN tblPlatforms c ON c.iPlatformID = a.iPlatformID
                            INNER JOIN tblVehicles d ON d.iVehicleID = a.iVehicleID
                            INNER JOIN tblTracks e ON e.iTrackID = a.iTrackID
                            INNER JOIN tblGameMode f ON f.iGameModeID = a.iGameModeID
                            INNER JOIN tblUsers g ON g.iUserID = a.iUserID
                        ORDER BY a.strSubmittedDate DESC;"""

    if (mode == "search" or mode == "search_from_sub"):
        rows = db.execute(sql_query, *params)
    elif (mode == "profile"):
        rows = db.execute(sql_query, session["user_id"])
    else:
        rows = db.execute(sql_query)

    """
    testRecord1 = {"strDisplayName":"Bob", "strVehicle":"Mazda Miata 1999"}
    recordPreview.append(testRecord1)
    testRecord1 = {"strDisplayName":"Bob", "strVehicle":"Mazda Miata 1999"}
    recordPreview.append(testRecord1)
    testRecord1 = {"strDisplayName":"Bob", "strVehicle":"Mazda Miata 1999"}
    recordPreview.append(testRecord1)
    testRecord1 = {"strDisplayName":"Bob", "strVehicle":"Mazda Miata 1999"}
    recordPreview.append(testRecord1)
    """
    
    return jsonify(rows)


@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html", page_type="logIn", login_msg='')


@app.route("/nav_login_JS", methods=["POST"])
def nav_login_JS():
    return jsonify({'redirect': url_for("login")})


@app.route("/login_SQL", methods=["POST"])
def login_SQL():

    session.clear()

    if request.method == "POST":
        data = request.json
        username = data["username"]
        password = data["password"]

        rows = db.execute("SELECT * FROM tblUsers WHERE strUserName = ?", username)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["strHashPW"], password):
            return jsonify({"status": "ERROR", "message": "Invalid username and/or password"})

        # Remember which user has logged in
        session["user_id"] = rows[0]["iUserID"]

        return jsonify({"status": "GOOD", "redirect": url_for("profile")})

    else:
        return jsonify({"status": "ERROR", "message": "ERROR"})


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")


@app.route("/register", methods=["GET","POST"])
def register():
    """User register"""

    __login_msg = ''
    return render_template("register.html", page_type="register", register_msg='')


@app.route("/nav_register_JS", methods=["POST"])
def nav_register_JS():
    return jsonify({'redirect': url_for("register")})


@app.route("/validate_registration", methods=["POST"])
def validate_registration():
    if request.method == "POST":
        data = request.json
        display_name = data["display_name"]
        username = data["username"]
        password = data["password"]
        password_again = data["password_again"]

        rows = db.execute("SELECT * FROM tblUsers WHERE strDisplayName = ?", display_name)

        if len(rows) > 0:
            return jsonify({"status":"ERROR" ,"message": "Display name already exists!"})
        
        rows = db.execute("SELECT * FROM tblUsers WHERE strUserName = ?", username)

        if len(rows) > 0:
            return jsonify({"status":"ERROR" ,"message": "Username already exists!"})
        
        if password != password_again:
            return jsonify({"status":"ERROR" ,"message": "Passwords do not match!"})
        
        timestamp = time.time() # in sec since epoch
        # data["timestamp"] = timestamp   #select time(time) from test order by time(time) desc;

        primKeyID = db.execute("""INSERT INTO tblUsers(strJoinDateEST, strUserName, strHashPW, strDisplayName) 
                                VALUES (?, ?, ?, ?)"""
                               ,timestamp, username, generate_password_hash(password), display_name)

        return jsonify({"status":"GOOD" ,"redirect": url_for("login")})
    else:
        return jsonify({"status":"ERROR" ,"message": "ERROR"})
    
"""
@app.route("/searchSuggestions")    # route name for JS
def searchGameSuggestions():
    q = request.args.get("q")

    if q:
        gameSuggestions = db.execute("SELECT * FROM tblGames WHERE strGameName LIKE ?", "%" + q + "%")
    else:
        gameSuggestions = []
    return jsonify(gameSuggestions)
"""

@app.route("/searchSuggestions", methods=["POST"])    # route name for JS
def searchSuggestions():
    if request.method == "POST":
        data = request.json
        table = data["table"]
        column = data["column"]
        userSearch = data["userSearch"]

        sqlQuery = "SELECT * FROM " + table + " WHERE " + column + " LIKE ?"

        rows = db.execute(sqlQuery, "%" + userSearch + "%")

        return jsonify(rows)

    return
    

@app.route("/submit_record", methods=["POST"])
def submit_record():
    if request.method == "POST":
        data = request.json
        game = data["game"]
        platform = data["platform"]
        vehicle = data["vehicle"]
        YTURL = data["YTURL"]
        track = data["track"]
        gamemode = data["gamemode"]
        fulltime_HH = data["fulltime_HH"]
        fulltime_MM = data["fulltime_MM"]
        fulltime_SS = data["fulltime_SS"]
        fulltime_sss = data["fulltime_sss"]
        laptime_HH = data["laptime_HH"]
        laptime_MM = data["laptime_MM"]
        laptime_SS = data["laptime_SS"]
        laptime_sss = data["laptime_sss"]
        desc = data["desc"]

        # build time formats to HH:MM:SS.sss
        fullTime = padLeadingZeroes(fulltime_HH, 2) + ":" + padLeadingZeroes(fulltime_MM, 2) + ":" + padLeadingZeroes(fulltime_SS, 2) + "." + padLeadingZeroes(fulltime_sss, 3)
        lapTime = padLeadingZeroes(laptime_HH, 2) + ":" + padLeadingZeroes(laptime_MM, 2) + ":" + padLeadingZeroes(laptime_SS, 2) + "." + padLeadingZeroes(laptime_sss, 3)
        
        # user id is in session["user_id"]

        # game
        # SELECT if game exists get ID, else add to tblGames
        rows = db.execute("SELECT iGameID FROM tblGames WHERE strGameName = ? ORDER BY iGameID asc LIMIT 1", game)
        iGameID = None

        if len(rows) == 0:
            # add
            iGameID = db.execute("""INSERT INTO tblGames(strGameName) 
                                    VALUES (?)""", game)
        else:
            iGameID = rows[0]["iGameID"]

        if (iGameID == None):
            return jsonify({"status":"ERROR" ,"message": "iGameID error"})
        # /game

        # Platform
        # SELECT if game exists get ID, else add to tblPlatforms
        rows = db.execute("SELECT iPlatformID FROM tblPlatforms WHERE strPlatformName = ? ORDER BY iPlatformID asc LIMIT 1", platform)
        iPlatformID = None

        if len(rows) == 0:
            # add
            iPlatformID = db.execute("""INSERT INTO tblPlatforms(strPlatformName) 
                                    VALUES (?)""", platform)
        else:
            iPlatformID = rows[0]["iPlatformID"]

        if (iPlatformID == None):
            return jsonify({"status":"ERROR" ,"message": "iPlatformID error"})
        # /Platform

        # tblVehicles
        rows = db.execute("SELECT iVehicleID FROM tblVehicles WHERE strVehicleName = ? ORDER BY iVehicleID asc LIMIT 1", vehicle)
        iVehicleID = None

        if len(rows) == 0:
            # add
            iVehicleID = db.execute("""INSERT INTO tblVehicles(strVehicleName) 
                                    VALUES (?)""", vehicle)
        else:
            iVehicleID = rows[0]["iVehicleID"]

        if (iVehicleID == None):
            return jsonify({"status":"ERROR" ,"message": "iVehicleID error"})
        # /tblVehicles

        # tblTracks
        rows = db.execute("SELECT iTrackID FROM tblTracks WHERE strTrackName = ? ORDER BY iTrackID asc LIMIT 1", track)
        iTrackID = None

        if len(rows) == 0:
            # add
            iTrackID = db.execute("""INSERT INTO tblTracks(strTrackName) 
                                    VALUES (?)""", track)
        else:
            iTrackID = rows[0]["iTrackID"]

        if (iTrackID == None):
            return jsonify({"status":"ERROR" ,"message": "iTrackID error"})
        # /tblTracks

        # tblGameMode
        rows = db.execute("SELECT iGameModeID FROM tblGameMode WHERE strGameModeName = ? ORDER BY iGameModeID asc LIMIT 1", gamemode)
        iGameModeID = None

        if len(rows) == 0:
            # add
            iGameModeID = db.execute("""INSERT INTO tblGameMode(strGameModeName) 
                                    VALUES (?)""", gamemode)
        else:
            iGameModeID = rows[0]["iGameModeID"]

        if (iGameModeID == None):
            return jsonify({"status":"ERROR" ,"message": "iGameModeID error"})
        # /tblGameMode


        timestamp = time.time() # save as UTC epoch

        # INSERT into table, it returns the ID
        primKeyID = db.execute("""INSERT INTO tblSubmissions(strSubmittedDate, strEditedDate, iGameID, iPlatformID, iVehicleID, iTrackID, iGameModeID, 
                                                            strFullTime, strBestLap, strProofYTURL, strHidden, strVerified, iUserID, strDesc) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
                               ,timestamp, timestamp, iGameID, iPlatformID, iVehicleID, iTrackID, iGameModeID, fullTime, lapTime, YTURL, 'N', 'N', 
                                session["user_id"], desc)

        # select the ID, if exxists, success else fail
        if (primKeyID == None):
            return jsonify({"status":"ERROR" ,"message": "primKeyID error"})

        return jsonify({"status":"GOOD", "message": "Record successfully added!", "redirect": url_for("submit")})  # url for is the function name 
    else:
        return jsonify({"status":"ERROR" ,"message": "ERROR"})
    

@app.route("/deleteSubmission", methods=["POST"])
def deleteSubmission():
    
    if request.method == "POST":
        print("there")
        data = json.loads(request.form.get("delete_json"))
        userID = data["user_id"]
        submissionID = data["submission_id"]

        rows = db.execute("""SELECT * FROM tblSubmissions WHERE iSubmissionID = ? AND iUserID = ?""", submissionID, userID)
        
        if len(rows) == 0:
            return jsonify({"status":"ERROR" ,"message": "No rows to delete!"})
        elif len(rows) > 1:
            return jsonify({"status":"ERROR" ,"message": "Somehow too may rows!"})
        elif len(rows) == 1:
            numRowsDel = db.execute("""DELETE FROM tblSubmissions WHERE iSubmissionID = ? AND iUserID = ?""", submissionID, userID)
            
            if numRowsDel == 1:
                return jsonify({"status":"GOOD" ,"message": "Submission deleted!"})
            else:
                return jsonify({"status":"ERROR" ,"message": "Something has gone horribly wrong!"})
        else:
            return jsonify({"status":"ERROR" ,"message": "???"})
        

@app.route('/getUserNumOfSubmissions', methods=["POST"])
def getUserNumOfSubmissions():
    if request.method == "POST":

        sql_query = "SELECT count(iSubmissionID) as 'numSubCnt' FROM tblSubmissions WHERE iUserID = ?"

        rows = db.execute(sql_query, session["user_id"])

        if len(rows) == 1:
            return jsonify({"status":"GOOD" ,"message": rows[0]["numSubCnt"]})
        else:
            return jsonify({"status":"ERROR" ,"message": "sql error"})
    else:
        return jsonify({"status":"ERROR" ,"message": "???"})
    

@app.route('/getUserMostSubmittedX', methods=["POST"])
def getUserMostSubmittedX():
    if request.method == "POST":
        
        data = json.loads(request.form.get("json_data"))
        table = data["table"]
        idCol = data["dbIDCol"]
        nameCol = data["dbNameCol"]

        
        #sql_query = """SELECT b.{nameColft}, count(a.{idColft}) 
        #                FROM tblSubmissions a 
        #                    INNER JOIN {tableft} b ON b.{idColft} = a.{idColft} 
        #                WHERE a.iUserID = ?
        #                GROUP BY a.{idColft}
        #                ORDER BY count(a.{idColft}) DESC
        #                    LIMIT 1""".format(nameColft = nameCol, idColft = idCol, tableft = table)
        # format causing > RuntimeError: fewer placeholder () than values (3)

        sql_query = """SELECT b.""" + nameCol + """, count(a.""" + idCol + """) 
                        FROM tblSubmissions a 
                            INNER JOIN """ + table + """ b ON b.""" + idCol + """ = a.""" + idCol + """
                        WHERE a.iUserID = ?
                        GROUP BY a.""" + idCol + """
                        ORDER BY count(a.""" + idCol + """) DESC
                            LIMIT 1"""
        
        
        rows = db.execute(sql_query, session["user_id"])

        #print(rows)

        if len(rows) == 1:
            return jsonify({"status":"GOOD" ,"message": rows[0][nameCol]})
        else:
            return jsonify({"status":"ERROR" ,"message": "N/A"})
    else:
        return jsonify({"status":"ERROR" ,"message": "???"})
    

@app.route("/getUserProfileDisplayInfo", methods=["POST"])
def getUserProfileDisplayInfo():
    if request.method == "POST":
        sql_query = "SELECT strDisplayName, strProfilePicSrc FROM tblUsers WHERE iUserID = ?"

        rows = db.execute(sql_query, session["user_id"])

        if len(rows) == 1:
            return jsonify({"status":"GOOD", "displayName": rows[0]["strDisplayName"], "profilePic": rows[0]["strProfilePicSrc"]})
        else:
            return jsonify({"status":"ERROR" ,"message": "N/A"})
    else:
        return jsonify({"status":"ERROR" ,"message": "???"})


app.route("/update_user_settings_initiate", methods=["POST"])
def update_user_settings_initiate():
    if request.method == "POST":
        data = json.loads(request.form.get("json_data"))
        updateSection = data["update_section"]

        sql_query = ""

        if (updateSection == "profile_pic"):
            # todo
            pass
        elif (updateSection == "display_name"):
            sql_query = "UPDATE strDisplayName = " + data["new_display_name"]
        elif (updateSection == "password"):
            # todo password validation
            sql_query = "UPDATE strHashPW = " + data["new_password"]


"""





Pract 
    fetch master and rebase branch
    push branch
    create pull request with main
    

TODO

- API from game image
- profile info -- TODO: 
    - Get profile pic in getUserProfileDisplayInfo for profile page
- settings page to update user settings
    - display / password -- HERE
    - profile pic -- TODO

    



- Custom Page system. 10 submissions per page
    - filter by full time only
    - button for first page
    - button for prev page
    - input box for cur page
    - button for next page
    - button for last page





    
https://jinja.palletsprojects.com/en/3.0.x/templates/
"""