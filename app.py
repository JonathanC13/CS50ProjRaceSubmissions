import os
import time
import decimal
import json

import io
import base64
from PIL import Image
import math
#import logging

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

PROFILEPICSIZE = 80, 80

PROFILE_PIC_PATH = os.getcwd() + "/static/userProfilePics/"

#logging.getLogger("cs50").disabled = False

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
    return render_template("home.html", page_type="home", search_params = "")

@app.route("/blankTest")
def blankTest():
    return render_template("blankTest.html")


@app.route("/nav_index_JS", methods=["POST"])
def nav_index_JS():
    return jsonify({'redirect': url_for("index")})


@app.route("/submissions")
def submissions():
    return render_template("home.html", page_type="search", search_params = session["search_from_profile_dict"])


@app.route("/nav_search_JS", methods=["POST"])
def nav_search_JS():
    session["search_from_profile_dict"] = ""
    return jsonify({'redirect': url_for("submissions")})


@app.route("/nav_search_from_profile", methods=["POST"])
def nav_search_from_profile():
    if request.method == "POST":
        #print("we in")
        data = request.json
        session["search_from_profile_dict"] = request.json
        
    
    return jsonify({'redirect': url_for("submissions")})


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    return render_template("profile.html", page_type="profile", search_params = "")


@app.route("/nav_profile_JS", methods=["POST"])
def nav_profile_JS():
    return jsonify({'redirect': url_for("profile")})


@app.route("/submit")
@login_required
def submit():
    return render_template("submit.html", page_type="submit", search_params = "")


@app.route("/nav_submit_JS", methods=["POST"])
def nav_submit_JS():
    return jsonify({'redirect': url_for("submit")})


@app.route("/user_settings", methods=["GET","POST"])
@login_required
def user_settings():
    imageFilename = "/static/userProfilePics/"

    if request.method == "POST":
        if (session.get('user_id') is not None):
            rows = db.execute("SELECT strProfilePicSrc FROM tblUsers WHERE strUserName = ? ", session["user_id"])
            
            if not rows:
                pass
            elif len(rows) == 1:
                imageFilename = imageFilename + rows[0]["strProfilePicSrc"]

    if imageFilename == "/static/userProfilePics/":
        imageFilename = imageFilename + "blackSquare.png"

    return render_template("user_settings.html", page_type="settings", search_params = "")


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
            
        params = []

        data = json.loads(request.form.get("search_json"))
        
        mode = data["mode"]
        
        if (mode == "search" or mode == "search_from_sub" or mode == "search_from_sub_profile"):

            searchDict = {}
            
            searchDict["strGameName"] = str(data["strGameName"]).upper()
            searchDict["strPlatformName"] = str(data["strPlatformName"]).upper()
            searchDict["strDisplayName"] = str(data["strDisplayName"]).upper()
            searchDict["strVehicleName"] = str(data["strVehicleName"]).upper()
            searchDict["strTrackName"] = str(data["strTrackName"]).upper()
            searchDict["strGameModeName"] = str(data["strGameModeName"]).upper()
            

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
                    
                    params.append("%" + val + "%")

                    if (count == 0):
                        # first query condition
                        sql_query = sql_query + " WHERE"
                    else:
                        sql_query = sql_query + " AND"

                    sql_query = sql_query + " UPPER(" + key + ") LIKE ?"

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
    #for x in params:
    #    print(x + '\n')
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

    if (mode == "search" or mode == "search_from_sub" or mode == "search_from_sub_profile"):
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
    return render_template("login.html", page_type="log in", login_msg='', search_params = "")


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

        rows = db.execute("SELECT * FROM tblUsers WHERE strUserName = ? ", username)

        # Ensure username exists and password is correct
        if not rows:
            return jsonify({"status": "ERROR", "message": "Invalid username and/or password!"})
        elif len(rows) != 1 or not check_password_hash(rows[0]["strHashPW"], password):
                return jsonify({"status": "ERROR", "message": "Invalid username and/or password!"})

        # Remember which user has logged in
        session["user_id"] = rows[0]["iUserID"]

        return jsonify({"status": "GOOD", "redirect": url_for("profile")})

    else:
        return jsonify({"status": "ERROR", "message": "GET"})


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
    return render_template("register.html", page_type="register", register_msg='', search_params = "")


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

        rows = db.execute("SELECT * FROM tblUsers WHERE strDisplayName = ? ", display_name)

        if len(rows) > 0:
            return jsonify({"status":"ERROR" ,"message": "Display name already exists!"})
        
        rows = db.execute("SELECT * FROM tblUsers WHERE strUserName = ? ", username)

        if len(rows) > 0:
            return jsonify({"status":"ERROR" ,"message": "Username already exists!"})
        
        if password != password_again:
            return jsonify({"status":"ERROR" ,"message": "Passwords do not match!"})
        
        timestamp = time.time() # in sec since epoch
        # data["timestamp"] = timestamp   #select time(time) from test order by time(time) desc;

        primKeyID = db.execute("""INSERT INTO tblUsers(strJoinDateEST, strUserName, strHashPW, strDisplayName, strProfilePicSrc) 
                                VALUES (?, ?, ?, ?, ?)"""
                               ,timestamp, username, generate_password_hash(password), display_name, "blackSquare.png")

        return jsonify({"status":"GOOD" ,"redirect": url_for("login")})
    else:
        return jsonify({"status":"ERROR" ,"message": "GET"})
    
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

@app.route("/inputSuggestions", methods=["POST"])    # route name for JS
def inputSuggestions():
    if request.method == "POST":
        data = request.json
        table = data["table"]
        relCol = data["relCol"]
        column = data["column"]
        userSearch = data["userSearch"]
        suggestionType = data["suggestionType"]

        if (suggestionType == "search"):
            sqlQuery = "SELECT " + column + " FROM :table a INNER JOIN tblSubmissions b ON b.:relCol = a.:relCol GROUP BY b.:relCol;"
            rows = db.execute(sqlQuery,table = table, relCol = relCol)

        elif (suggestionType == "submit"):
            sqlQuery = "SELECT * FROM " + table + " WHERE " + column + " LIKE ?"

            rows = db.execute(sqlQuery, "%" + userSearch + "%")
        else:
            return "{}"
        print(suggestionType)
        print(rows)
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

        if not rows or len(rows) == 0:
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

        if not rows or len(rows) == 0:
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

        if not rows or len(rows) == 0:
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

        if not rows or len(rows) == 0:
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

        if not rows or len(rows) == 0:
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

        rows = db.execute("SELECT * FROM tblSubmissions WHERE iSubmissionID = ? AND iUserID = ? ", submissionID, userID)
        
        if not rows or len(rows) == 0:
            return jsonify({"status":"ERROR" ,"message": "No rows to delete!"})
        elif len(rows) > 1:
            return jsonify({"status":"ERROR" ,"message": "Somehow too may rows!"})
        elif len(rows) == 1:
            numRowsDel = db.execute("DELETE FROM tblSubmissions WHERE iSubmissionID = ? AND iUserID = ? ", submissionID, userID)
            
            if numRowsDel == 1:
                return jsonify({"status":"GOOD" ,"message": "Submission deleted!"})
            else:
                return jsonify({"status":"ERROR" ,"message": "Something has gone horribly wrong!"})
        else:
            return jsonify({"status":"ERROR" ,"message": "???"})
        

@app.route('/getUserNumOfSubmissions', methods=["POST"])
def getUserNumOfSubmissions():
    if request.method == "POST":

        sql_query = "SELECT count(iSubmissionID) as 'numSubCnt' FROM tblSubmissions WHERE iUserID = ? "

        rows = db.execute(sql_query, session["user_id"])

        if not rows:
            return jsonify({"status":"ERROR" ,"message": "sql error"})
        elif len(rows) == 1:
            return jsonify({"status":"GOOD" ,"message": rows[0]["numSubCnt"]})
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
         #               FROM tblSubmissions a 
         #                   INNER JOIN {tableft} b ON b.{idColft} = a.{idColft} 
         #               WHERE a.iUserID = ?
         #               GROUP BY a.{idColft}
         #               ORDER BY count(a.{idColft}) DESC
         #                   LIMIT 1""".format(nameColft = nameCol, idColft = idCol, tableft = table)
        
        sql_query = """SELECT b.:nameColft, count(a.:idColft) 
                        FROM tblSubmissions a 
                            INNER JOIN :tableft b ON b.:idColft = a.:idColft 
                        WHERE a.iUserID = :userID
                        GROUP BY a.:idColft
                        ORDER BY count(a.:idColft) DESC
                            LIMIT 1"""
        
        # both above methods error sometimes
        # Need to fix > RuntimeError: fewer placeholder () than values (3) for app.py function getUserMostSubmittedX that happens sometimes due to timeout(?)

        
        
        rows = db.execute(sql_query, nameColft=nameCol, idColft=idCol, tableft=table, userID=session["user_id"])

        #print(rows)

        if len(rows) == 1:
            return jsonify({"status":"GOOD" ,"message": rows[0][nameCol]})
        else:
            return jsonify({"status":"ERROR" ,"message": "N/A"})
    else:
        return jsonify({"status":"ERROR" ,"message": "???"})
    

@app.route("/getUserProfileStats", methods=["POST"])
def getUserProfileStats():
    if request.method == "POST":
        data = json.loads(request.form.get("json_data"))
        userID = data["user_id"]

        dictReturn = {}

        # get number of user submissions 
        #sql_query = "SELECT count(iSubmissionID) as 'numSubCnt' FROM tblSubmissions = ?"

        # this error is pissing me off. RuntimeError: fewer placeholders () than values (3). 
        rows = db.execute("SELECT count(iSubmissionID) as 'subCnt' FROM tblSubmissions WHERE iUserID = ? ", userID)
        
        if not rows:
            dictReturn["idNumOfSub"] = "N/A"
        elif len(rows) == 1:
            dictReturn["idNumOfSub"] = rows[0]["subCnt"]
        else:
            dictReturn["idNumOfSub"] = "error"
        
        # /get number of user submissions

        # get most submitted game, track, vehicle, and game mode
        dictProfileFields = {
            "game":
                {
                    "table":"tblGames",
                    "dbIDCol":"iGameID",
                    "dbNameCol":"strGameName",
                    "profileElemID":"idMostSubGame"
                },
            "track":
                {  
                    "table":"tblTracks",
                    "dbIDCol":"iTrackID",
                    "dbNameCol":"strTrackName",
                    "profileElemID":"idMostSubTrack"
                },
            "vehicle":
                {  
                    "table":"tblVehicles",
                    "dbIDCol":"iVehicleID",
                    "dbNameCol":"strVehicleName",
                    "profileElemID":"idMostSubVehicle"
                },
            "gameMode":
                {  
                    "table":"tblGameMode",
                    "dbIDCol":"iGameModeID",
                    "dbNameCol":"strGameModeName",
                    "profileElemID":"idMostSubGameMode"
                }
        }

        # I HATE the fewer placeholders than values WHEN I HAVE THE RIGHT NUMBER OF PLACEHOLDERS
        for key, val in dictProfileFields.items():
            #rows = db.execute("""SELECT b.{nameColft}, count(a.{idColft}) 
            #                    FROM tblSubmissions a 
            #                        INNER JOIN {tableft} b ON b.{idColft} = a.{idColft} 
            #                    WHERE a.iUserID = {userID} 
            #                    GROUP BY a.{idColft}
            #                    ORDER BY count(a.{idColft}) DESC
            #                        LIMIT 1""".format(nameColft = val["dbNameCol"], idColft = val["dbIDCol"], tableft = val["table"], userID = str(userID)))   

            rows = db.execute("""SELECT b.:nameColft, count(a.:idColft) 
                                FROM tblSubmissions a 
                                    INNER JOIN :tableft b ON b.:idColft = a.:idColft
                                WHERE a.iUserID = :userID 
                                GROUP BY a.:idColft
                                ORDER BY count(a.:idColft) DESC
                                    LIMIT 1""", nameColft = val["dbNameCol"], idColft = val["dbIDCol"], tableft = val["table"], userID = str(userID)) 

            # both above methods error sometimes


            if not rows:
                dictReturn[val["profileElemID"]] = "N/A"  
            elif len(rows) == 1:
                dictReturn[val["profileElemID"]] = rows[0][val["dbNameCol"]]
            else:
                dictReturn[val["profileElemID"]] = "error"      
                
        # /get most submitted game, track, vehicle, and game mode
            
        dictReturn["status"] = "GOOD"
        return jsonify(dictReturn)

    else:
        return jsonify({"status":"ERROR" ,"message": "Get profile stats error!"})
    

@app.route("/getUserProfileDisplayInfo", methods=["POST"])
def getUserProfileDisplayInfo():
    if request.method == "POST":
        profilePicSrc = "/static/userProfilePics/"

        data = json.loads(request.form.get("json_data"))
        userID = data["user_id"]

        #sql_query = "SELECT strDisplayName, strProfilePicSrc FROM tblUsers WHERE iUserID = ?"

        rows = db.execute("SELECT strDisplayName, strProfilePicSrc FROM tblUsers WHERE iUserID = ? ", userID)

        if not rows:
            return jsonify({"status":"ERROR" ,"message": "N/A"})
        elif len(rows) == 1:
            if rows[0]["strProfilePicSrc"] != None:
                profilePicSrc = profilePicSrc + rows[0]["strProfilePicSrc"]

            return jsonify({"status":"GOOD", "displayName": rows[0]["strDisplayName"], "profilePicSrc": profilePicSrc})
        else:
            return jsonify({"status":"ERROR" ,"message": "error"})
    else:
        return jsonify({"status":"ERROR" ,"message": "Get profile error!"})


"""
@app.route("/updateProfilePic", methods=["GET", "POST"])
def updateProfilePic():
    
    if request.method == "POST":
        newProfilePicFileInput = request.files["input_display_pic"]
        fileName = newProfilePicFileInput.filename

        fileExtension = fileName[fileName.rfind(".") + 1:]    # look for last occurence of '.' then get the characters that follow.
        if (fileExtension.upper() == 'JPG'):
            fileExtension = 'JPEG'

        # pillows
        img = Image.open(newProfilePicFileInput)
        percentWidth = PROFILEPICSIZE[0] / img.size[0]
        percentHeight = PROFILEPICSIZE[1] / img.size[1]
        ratioPercent = None
        
        if percentWidth > percentHeight:
            ratioPercent = percentWidth
        else:
            ratioPercent = percentHeight

        #img.thumbnail(PROFILEPICSIZE)
        newSize = math.ceil(ratioPercent * img.size[0]), math.ceil(ratioPercent * img.size[1])
        
        newImg = img.resize(newSize)
        newImg.save(os.path.join(PROFILE_PIC_PATH, fileName))
        
        # save image to directory
        #newProfilePicFileInput.save(os.path.join(PROFILE_PIC_PATH, fileName))

        newProfilePicFileInput = "/static/userProfilePics/" + fileName
        return render_template("user_settings.html", page_type="settings", profilePicSrc=newProfilePicFileInput)
        return user_settings() # uncomment when save file into user table row. This function needs to get the filename from db
    
    return jsonify({"status":"ERROR" ,"message": "ERR!"}) 
    """
    
"""
newProfilePicFileName = ""
newProfilePicBytesStr = ""



if (updateSection == "profile_pic"):
        newProfilePicFileName = data["new_profile_pic_filename"]
        newProfilePicBytesStr = data["new_profile_pic_bytes"]
        print (newProfilePicBytesStr)
        profilePicBytes = bytes(newProfilePicBytesStr, 'utf-8')
        print('--')
        print(profilePicBytes)

        sql_querySELECT = "SELECT iUserID, strProfilePicSrc "
        #return jsonify({"status":"GOOD" ,"bytesBack": newProfilePicBytesStr})

        # find if any other records have a filename that is the same
        sql_querySELECT = sql_querySELECT + "FROM tblUsers a WHERE iUserID = ? AND UPPER(strProfilePicSrc) = ? "

        rows = db.execute(sql_querySELECT, userID, newProfilePicFileName.upper())

        if len(rows) == 0:
            # good to add file with name as is
            # save to dir
            profilePicPath = profilePicPath + newProfilePicFileName
            fileExtension = newProfilePicFileName[newProfilePicFileName.rfind(".")+1:]    # look for last occurence of '.' then get the characters that follow.

            imgObj = Image.open(io.BytesIO(profilePicBytes))
            imgObj.show()

            return jsonify({"status":"GOOD" ,"bytesBack": newProfilePicBytesStr})
            try:
                Image.save(profilePicPath, fileExtension)
            except Exception as e:
                print(str(e))
                return jsonify({"status":"ERROR" ,"message": str(e)})

            # attempt to update with the file name
            sql_querySELECT = "SELECT iUserID FROM tblUsers WHERE iUserID = ? "
            rows = db.execute(sql_querySELECT, userID)

            if len(rows) == 1:
                sql_queryUPDATE = "UPDATE tblUsers SET strProfilePicSrc = ? WHERE iUserID = ? "
                numRowsUpdated = db.execute(sql_queryUPDATE, newProfilePicFileName, userID)

                if numRowsUpdated == 1:
                    return jsonify({"status":"GOOD" ,"message": "Successfully changed!"})
                else:
                    return jsonify({"status":"ERROR" ,"message": "Unsuccessfully changed!"})
            else:
                return jsonify({"status":"ERROR" ,"message": "QUERY ERROR!"}) 
        elif len(rows) == 1:
            # rename new file
            pass
        elif len(rows) > 1:
            # something went wrong previously, update the filenames of the existing records
            pass
        else:
            return jsonify({"status":"ERROR" ,"message": "Unsuccessfully changed!"})
"""


@app.route("/updateProfilePic", methods=["GET", "POST"])
def updateProfilePic():

    if request.method == "POST":

        userID = request.form["user_id"]
        newProfilePicFileInput = request.files["input_display_pic"]
        fileName = newProfilePicFileInput.filename
        oldProfilePicSrc = ''

        fileNameActual = fileName[:fileName.rfind(".")]

        fileExtension = fileName[fileName.rfind(".") + 1:]    # look for last occurence of '.' then get the characters that follow.
        if (fileExtension.upper() == 'JPG'):
            fileExtension = 'JPEG'

        count = 0
        # set unique file name if needed
        while (os.path.isfile(os.path.join(PROFILE_PIC_PATH, fileName))):
            fileName = fileNameActual + '_' + str(count) + '.' + fileExtension
            count = count + 1
        # /set unique file name if needed
            
        # get previous strProfilePicSrc
        sql_query = "SELECT strProfilePicSrc FROM tblUsers WHERE iUserID = ? "

        rows = db.execute(sql_query, userID)

        if not rows:
            return jsonify({"status":"ERROR" ,"message": "N/A"})
        elif len(rows) == 1:
            if rows[0]["strProfilePicSrc"] != None:
                oldProfilePicSrc = rows[0]["strProfilePicSrc"]
        else:
            return jsonify({"status":"ERROR" ,"message": "error"})
        # /get previous strProfilePicSrc

        # save profile pic to file sys
        # pillows; https://pillow.readthedocs.io/en/stable/reference/Image.html
        img = Image.open(newProfilePicFileInput)
        percentWidth = PROFILEPICSIZE[0] / img.size[0]
        percentHeight = PROFILEPICSIZE[1] / img.size[1]
        ratioPercent = None
        
        if percentWidth > percentHeight:
            ratioPercent = percentWidth
        else:
            ratioPercent = percentHeight

        #img.thumbnail(PROFILEPICSIZE)
        newSize = math.ceil(ratioPercent * img.size[0]), math.ceil(ratioPercent * img.size[1])
        
        newImg = img.resize(newSize)

        try:
            newImg.save(os.path.join(PROFILE_PIC_PATH, fileName))
        except ValueError:
            return jsonify({"status":"ERROR" ,"message": "Format error!"})
        except OSError:
            return jsonify({"status":"ERROR" ,"message": "Could not save!"})
        
        
        # save image to directory
        #newProfilePicFileInput.save(os.path.join(PROFILE_PIC_PATH, fileName))

        newProfilePicFileInput = "/static/userProfilePics/" + fileName
        # /save profile pic to file sys

        # update strProfilePicSrc in tblUsers
        sql_queryUpdate = "UPDATE tblUsers SET strProfilePicSrc = ? WHERE iUserID = ? "
        updatedRows = db.execute(sql_queryUpdate, fileName, userID)

        if updatedRows != 1:
            return jsonify({"status":"ERROR" ,"message": "error"})
        # /update strProfilePicSrc in tblUsers

        #check tblUsers to see if other users use the same strProfilePicSrc somehow, only delete if none left
        sql_query = "SELECT count(strProfilePicSrc) as 'cnt' FROM tblUsers WHERE strProfilePicSrc = ? "
        rows = db.execute(sql_query, oldProfilePicSrc)

        if not rows:
            pass
        elif len(rows) == 1:
            if rows[0]["cnt"] == 0 and oldProfilePicSrc != '':
                if os.path.isfile(os.path.join(PROFILE_PIC_PATH, oldProfilePicSrc)):
                    try:
                        os.remove(os.path.join(PROFILE_PIC_PATH, oldProfilePicSrc))
                    except:
                        pass
                
        # /check tblUsers to see if other users use the same strProfilePicSrc somehow, only delete if none left 
        
        return jsonify({"status":"GOOD" ,"message": "Successfully changed!", "profilePicSrc": newProfilePicFileInput})
    else:
        return jsonify({"status":"ERROR" ,"message": "Unsuccessfully changed!"})


@app.route("/update_user_settings_initiate", methods=["POST"])
def update_user_settings_initiate():
    if request.method == "POST":
    
        data = json.loads(request.form.get("json_data"))
        updateSection = data["update_section"]
        userID = data["user_id"]
        newDisplayName = ""
        oldPassword = ""
        newPassword = ""

        sql_querySELECT = ""
        sql_queryUPDATE = ""

        if (updateSection == "display_name"):
            newDisplayName = data["new_display_name"]

            sql_querySELECT = "SELECT strDisplayName "
            sql_queryUPDATE = "UPDATE tblUsers SET strDisplayName = '" + newDisplayName + "' "

            sql_querySELECT = sql_querySELECT + "FROM tblUsers a WHERE iUserID = ? "

            rows = db.execute(sql_querySELECT, userID)

            if not rows:
                return jsonify({"status":"ERROR" ,"message": "QUERY ERROR!"}) 
            elif len(rows) == 1:
                sql_queryUPDATE = sql_queryUPDATE + "WHERE iUserID = ? "         
                
                numRowsUpdated = db.execute(sql_queryUPDATE, userID)

                if numRowsUpdated == 1:
                    return jsonify({"status":"GOOD" ,"message": "Successfully changed!"})
                else:
                    return jsonify({"status":"ERROR" ,"message": "Unsuccessfully changed!"})

            else:            
                return jsonify({"status":"ERROR" ,"message": "QUERY ERROR!"}) 
            
        elif (updateSection == "password"):
            oldPassword = data["old_password"]
            newPassword = data["new_password"]

            sql_querySELECT = "SELECT strHashPW "
            sql_queryUPDATE = "UPDATE tblUsers SET strHashPW = '" + generate_password_hash(newPassword) + "' "

            sql_querySELECT = sql_querySELECT + "FROM tblUsers a WHERE iUserID = ? "

            rows = db.execute(sql_querySELECT, userID)

            if not rows:
                return jsonify({"status":"ERROR" ,"message": "QUERY ERROR!"}) 
            elif len(rows) == 1:
                sql_queryUPDATE = sql_queryUPDATE + "WHERE iUserID = ? "
            
                # check select if 1 row returned, if 1 then execute update, if not return ERROR
                if (updateSection == "password" and not check_password_hash(rows[0]["strHashPW"], oldPassword)):
                    # old password validation                
                    return jsonify({"status":"ERROR" ,"message": "Old password does not match!"})            
                
                numRowsUpdated = db.execute(sql_queryUPDATE, userID)

                if numRowsUpdated == 1:
                    return jsonify({"status":"GOOD" ,"message": "Successfully changed!"})
                else:
                    return jsonify({"status":"ERROR" ,"message": "Unsuccessfully changed!"})

            else:            
                return jsonify({"status":"ERROR" ,"message": "QUERY ERROR!"}) 
        else:
            return jsonify({"status":"ERROR" ,"message": "No update section identified!"})
    
    else:
        return jsonify({"status":"ERROR" ,"message": "GET!"})
        
        


"""





Pract 
    fetch master and rebase branch
    push branch
    create pull request with main


- API to get random race track image -- done 
    -- document: https://pixabay.com/api/docs/

TODO
    - check navbar mouse icon for pages
    - test
    - read me and videeo


Damn, I'll never be as smart as someone like this guy.
https://www.raymondcamden.com/2022/03/14/building-table-sorting-and-pagination-in-javascript
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

    
https://jinja.palletsprojects.com/en/3.0.x/templates/
"""
