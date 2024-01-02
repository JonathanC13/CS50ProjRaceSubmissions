CREATE TABLE tblUsers (
    iUserID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strJoinDateEST INTEGER NOT NULL,
    strUserName TEXT NOT NULL,
    strHashPW TEXT NOT NULL,
    strDisplayName TEXT NOT NULL,
    strProfilePicSrc TEXT
);

CREATE TABLE tblSubmissions (
    iSubmissionID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strSubmittedDate INTEGER NOT NULL,
    strEditedDate INTEGER,
    iGameID INTEGER NOT NULL,
    iPlatformID INTEGER NOT NULL,
    iVehicleID INTEGER NOT NULL,
    iTrackID INTEGER NOT NULL,
    iGameModeID TEXT NOT NULL,
    strFullTime TEXT NOT NULL,
    strBestLap TEXT,
    strProofYTURL TEXT,
    strHidden TEXT NOT NULL,
    strVerified TEXT NOT NULL,
    iUserID INTEGER NOT NULL,
    strDesc TEXT NULL,
    FOREIGN KEY(iUserID) REFERENCES tblUsers(iUserID),
    FOREIGN KEY(iGameID) REFERENCES tblGames(iGameID),
    FOREIGN KEY(iPlatformID) REFERENCES tblPlatforms(iPlatformID),
    FOREIGN KEY(iVehicleID) REFERENCES tblVehicles(iVehicleID),
    FOREIGN KEY(iTrackID) REFERENCES tblTracks(iTrackID),
    FOREIGN KEY(iGameModeID) REFERENCES tblGameMode(iGameModeID)
);

CREATE TABLE tblGames (
    iGameID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strGameName TEXT NOT NULL
);

-- prefill with some games
INSERT INTO tblGames (strGameName)
    VALUES  ('Forza Motorsport'), 
            ('Dirt Rally 2'),
            ('Shift 2'),
            ('Forza Horizon 5'),
            ('Art of Rally'),
            ('Project Cars 2'),
            ('Wreckfest'),
            ('TrackMania 2: Canyon'),
            ('GRID Legends'),
            ('Driver: San Francisco'),
            ('F1 22'),
            ('Race: Injection'),
            ('Assetto Corsa Competizione'),
            ('iRacing');

CREATE TABLE tblPlatforms (
    iPlatformID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strPlatformName TEXT NOT NULL
);

INSERT INTO tblPlatforms (strPlatformName)
    VALUES  ("PC"),
            ("Xbox 360"),
            ("Xbox One"),
            ("Xbox Series X"),
            ("Xbox Series S"),
            ("Playstation 3"),
            ("Playstation 4"),
            ("Playstation 5"),
            ("Switch");

CREATE TABLE tblVehicles (
    iVehicleID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strVehicleName TEXT NOT NULL
);

-- prefill with some vehicles
INSERT INTO tblVehicles (strVehicleName)
    VALUES  ('Red Bull Racing - RB19'),
            ('Ferrari - SF-23'),
            ('Mercedes-AMG - F1 W14'),
            ('Alpine - A523'),
            ('McLaren - MCL60'),
            ('Alfa Romeo - C43'),
            ('Aston Martin - AMR23'),
            ('Haas - VF-23'),
            ('AlphaTauri - AT04'),
            ('Williams - FW45'),
            ('1985 Audi Sport Quattro S1'),
            ('1986 Ford RS200 Evolution'),
            ('1997 Subaru Impreza S3 WRC'),
            ('1997 Mitsubishi Lancer Evolution IV'),
            ('1975 Ford Escort RS1800'),
            ('1992 Toyota Celica GT-Four WRC');

CREATE TABLE tblTracks (
    iTrackID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strTrackName TEXT NOT NULL
);

-- prefill with some tracks
INSERT INTO tblTracks (strTrackName)
    VALUES  ('Bahrain International Circuit (Bahrain)'),
            ('Jeddah Corniche Circuit (Saudi Arabia)'),
            ('Albert Park, Melbourne (Australia)'),
            ('Baku City Circuit (Azerbaijan)'),
            ('Miami International Autodrome (USA)'),
            ('Imola, Autodromo Internazionale Enzo e Dino Ferrari (Italy)'),
            ('Monte Carlo Grand Prix Circuit (Monaco)'),
            ('Circuit de Barcelona-Catalunya (Spain)'),
            ('Circuit Gilles Villenueve, Montreal (Canada)'),
            ('Hungaroring (Hungary)'),
            ('Circuit de Spa-Francorchamps (Belgium)'),
            ('Monza (Italy)'),
            ('Singapore Marina Bay (Singapore)'),
            ('Suzuka (Japan)'),
            ('Losail International Circuit (Qatar)'),
            ('Circuit of the Americas (USA)'),
            ('Autódromo Hermanos Rodríguez, Mexico City (Mexico)'),
            ('Autódromo José Carlos Pace, Interlagos (Brazil)'),
            ('Las Vegas Strip Street Circuit (USA)'),
            ('Yas Marina Circuit (Abu Dhabi)'),
            ('Yas Marina Circuit, Abu Dhabi'),
            ('Mettet, Belgium'),
            ('Trois-Rivières, Canada'),
            ('Silverstone, England'),
            ('Lydden Hill, England'),
            ('Lohéac, Bretagne, France'),
            ('Estering, Germany'),
            ('Bikernieki, Latvia'),
            ('Hell, Norway'),
            ('Montalegre, Portugal'),
            ('Killarney International Raceway, South Africa'),
            ('Circuit de Barcelona-Catalunya, Spain'),
            ('Höljes, Sweden');

CREATE TABLE tblGameMode (
    iGameModeID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    strGameModeName TEXT NOT NULL
); 

-- prefill with some tracks
INSERT into tblGameMode (strGameModeName)
    VALUES  ('Rally'), 
            ('Rallycross'), 
            ('Trailblazer'), 
            ('Land Rush'),
            ('Raid'),
            ('Ranked multiplayer');


/*

SELECT * 
    FROM tblSubmissions a
        INNER JOIN tblGames b ON b.iGameID = a.iGameID
        INNER JOIN tblPlatforms c ON c.iPlatformID = a.iPlatformID
        INNER JOIN tblVehicles d ON d.iVehicleID = a.iVehicleID
        INNER JOIN tblTracks e ON e.iTrackID = a.iTrackID
        INNER JOIN tblGameMode f ON f.iGameModeID = a.iGameModeID
        INNER JOIN tblUsers g ON g.iUserID = a.iUserID
    ORDER BY a.strSubmittedDate DESC
    LIMIT 10;




---------

SELECT 

date_column_in_table,

date('now'),

date('now')-date(date_column_in_table) AS "Difference In years",

((julianday('now')-julianday(date_column_in_table))/(365/12)) As "Difference In Months",

((julianday('now')-julianday(date_column_in_table))/7) As "Difference In Weeks",

julianday('now')-julianday(date_column_in_table) AS "Difference in Days",

(julianday('now')-julianday(date_column_in_table)) * 24 "Difference In Hours",

(julianday('now')-julianday(date_column_in_table)) * 24 * 60 "Difference In Minutes",

strftime('%s','now')-strftime('%s',date_column_in_table) AS "Difference In Seconds"

From Table_Name


select datetime(strSubmittedDate, 'unixepoch', 'localtime') as 'strSubmittedDateFormatted' from tblSubmissions;

select datetime(strSubmittedDate, 'unixepoch') as 'strSubmittedDateFormatted' from tblSubmissions;

// doesn't work
SELECT strftime('%d-%m-%Y %H:%M:%f', strSubmittedDate/1000.0, 'unixepoch') FROM tblSubmissions;

*/