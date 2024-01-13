function test() {
    //window.location.assign("/profile");
    //window.location.replace("/profile");

    $.ajax({
        url: Flask.url_for('profile_JS'),
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(genres)
    }).done(function(response) {
        window.location.href = response.redirect
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}

function register() {
    var data_display_name = document.getElementById("reg_display_name").value.trim();
    var data_username = document.getElementById("reg_username").value.trim();
    var data_password = document.getElementById("reg_password").value.trim();
    var data_password_again = document.getElementById("reg_password_again").value.trim();

    const msg_register = document.getElementById("register_msg");

    if (data_display_name == "") 
    {
        msg_register.textContent = "Please enter a display name!";
        document.getElementById("reg_display_name").focus;
    }
    else if(data_username == "" )
    {
        msg_register.textContent = "Please enter a username!";
        document.getElementById("reg_username").focus;
    }
    else if(data_password == "")
    {
        msg_register.textContent = "Please enter a password!";
        document.getElementById("reg_password").focus;
    }
    else if(data_password_again == "")
    {
        msg_register.textContent = "Please confirm the password!";
        document.getElementById("reg_password_again").focus;
    }
    else
    {
        const obj = {display_name: data_display_name, username: data_username, 
                    password: data_password, password_again: data_password_again};
        const myJSON = JSON.stringify(obj);

        $.ajax({            
            url: "/validate_registration",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: myJSON
        }).done(function(response) {
            if(response["status"] == "GOOD") {
                window.location.href = response.redirect;
            }
            else
            {
                msg_register.textContent = response["message"];
            }
        }).fail(function(response) {
            msg_register.textContent = 'Failure, dev has low IQ.';
        });
    }

    return false;
}


function show_search_section(page) {
    var search_section = document.getElementById("search_section");

    if(search_section && page == "Search")
    {
        document.getElementById("search_section").style.display = "block";   
        document.getElementById("page_type").value = "Search"
        //console.log(document.getElementById("page_type").value);
        return 0;
    }
    else if (search_section && page == "Home")
    {
        document.getElementById("search_section").style.display = "none";   
        document.getElementById("page_type").value = "Home"
        return 1;
    }
    else
    {
        return -1;
    }
}


function nav_home_JS() {
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;

    if(page_type == "Search")
    {
        show_search_section("Home");
    }
    else
    {
        $.ajax({
            url: "/nav_index_JS",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: ""
        }).done(function(response) {
            //console.log(response.redirect);
            
            window.location.href = response.redirect;

        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
        });
    }

    $( ".nav-item" ).each( function() {
        $( this ).removeClass("active");
    });

    search("Default");

}


function nav_search_JS() {
    topFunction();
    var ret = show_search_section("Search");
    if(ret != 0)
    {
        $.ajax({
            url: "/nav_search_JS",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: ""
        }).done(function(response) {
            window.location.href = response.redirect;
        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
        });
    }
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;
    navbar_active(page_type);
}


function nav_profile_JS() {
    $.ajax({
        url: "/nav_profile_JS",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: ""
    }).done(function(response) {
        window.location.href = response.redirect;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}


function nav_submit_JS() {
    $.ajax({
        url: "/nav_submit_JS",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: ""
    }).done(function(response) {
        window.location.href = response.redirect;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}


function nav_user_settings_JS() {
    $.ajax({
        url: "/nav_user_settings_JS",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: ""
    }).done(function(response) {
        window.location.href = response.redirect;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}


function nav_register_JS() {
    $.ajax({
        url: "/nav_register_JS",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: ""
    }).done(function(response) {
        window.location.href = response.redirect;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}


function nav_login_JS() {
    $.ajax({
        url: "/nav_login_JS",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: ""
    }).done(function(response) {
        window.location.href = response.redirect;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}


function login_submit() {

    var data_user = document.getElementById("username").value.trim();
    var data_pass = document.getElementById("password").value.trim();

    const msg_login = document.getElementById("login_msg");

    if(data_user == "")
    {
        msg_login.textContent = "Must provide a username!";
        document.getElementById("username").focus;
    }
    else if(data_pass == "")
    {
        msg_login.textContent = "Must provide a password!";
        document.getElementById("password").focus;
    }
    else
    {
        // attempt to validate
        const obj = {username: data_user, password: data_pass};
        const myJSON = JSON.stringify(obj);

        $.ajax({
            url: "/login_SQL",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: myJSON
        }).done(function(response) {
            if(response["status"] == 'GOOD') {
                window.location.href = response.redirect;
            }
            else
            {
                msg_login.textContent = response["message"];                
            }            
        }).fail(function(response) {
            msg_login.textContent = 'Failure, dev has low IQ.';
        });
    }

    return false;
    
}


function search(mode) {
    
    // get user id if logged in
    // session["user_id"]
    var dictParams = {"callbackType":"search",
                        "mode":mode};
    getUserID(dictParams, searchInitiate);
    // /get user id if logged in
}


function searchInitiate(mode, user_id, optionalDict) {
    // submission results
    var submissions_section = document.getElementById("submissions_section");
    
    if(!submissions_section)
    {
        return;
    }

    if(mode == "Search")
    {
        search_params = JSON.stringify({"mode":mode,
                                    "strGameName":document.getElementById("search_game").value.trim(),
                                    "strPlatformName":document.getElementById("search_platform").value.trim(),
                                    "strDisplayName":document.getElementById("search_display_name").value.trim(),
                                    "strVehicleName":document.getElementById("search_vehicle").value.trim(),
                                    "strTrackName":document.getElementById("search_track").value.trim(),
                                    "strGameModeName":document.getElementById("search_game_mode").value.trim()
                                    });
    }
    else if(mode == "Profile")
    {
        search_params = JSON.stringify({"mode":mode});
    }
    else if(mode == "search_from_sub")
    {
        search_params = JSON.stringify(optionalDict);

        nav_search_JS();
        document.getElementById("search_game").value = optionalDict["strGameName"];
        document.getElementById("search_platform").value = optionalDict["strPlatformName"];
        document.getElementById("search_display_name").value = optionalDict["strDisplayName"];
        document.getElementById("search_vehicle").value = optionalDict["strVehicleName"];
        document.getElementById("search_track").value = optionalDict["strTrackName"];
        document.getElementById("search_game_mode").value = optionalDict["strGameModeName"];
    }
    else
    {
        search_params = JSON.stringify({"mode":"Default"});

        document.getElementById("search_game").value = "";
        document.getElementById("search_platform").value = "";
        document.getElementById("search_display_name").value = "";
        document.getElementById("search_vehicle").value = "";
        document.getElementById("search_track").value = "";
        document.getElementById("search_game_mode").value = "";
    }

    $.ajax({
        type:"post",
        url:"/populate_submissions_search",
        data:{search_json:search_params}
    }).done(function(response) {
        //console.log(response);
        //window.location.href = response.redirect;

        $('#submissions_section').html(build_submission_section(response, mode, user_id));
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
    // /submission results
}


function build_submission_section(results, mode, user_id) {
    //console.log(results);
    
    var html_section =
    `<div class="row">
        <div class="col-sm-1"></div>
        <div id="submission_col" class="col-sm-10">
            <div id="subtitle_div">
                <span id="subtitle_span">`;
    
    if (mode == "Search" || mode == "search_from_sub")
    {
        html_section +=
                    `Search results`;       
    }
    else if (mode == "Profile")
    {
        html_section +=
                    `Fastest times`;       
    }
    else
    {
        html_section +=
                    `Latest submissions`; 
    }

    html_section +=
                `</span>
                <span id="submissionListMessage">
                </span>
            </div>
            <br>`;

    //searchFromSubmission('` + value.strGameName + `', '` + value.strPlatformName + `', '` + value.strDisplayName + `', '` + value.strVehicleName + `', '` + value.strTrackName + `', '` + value.strGameModeName + `')
    if(results != "")
    {
        $.each(results, function(index, value) {
            deleteDisplay = (value.iUserID == user_id)?';':'none;';

            html_section += 
            `<div id="submission_col_container" class="container">
                <div class="row">
                    <!--row for Date, game, platform, and Search/Delete-->
                    <div class="col-sm-3 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span id="tooltip" onclick="searchFromSubmission('` + `` + `', '` + `` + `', '` + value.strDisplayName + `', '` + `` + `', '` + `` + `', '` + `` + `')">
                                <span class="titleColor">Display name: </span>
                                <span class="contentColor">` + value.strDisplayName + `</span>
                                <span id="tooltiptext">Search Display name</span>
                            </span>
                            
                        </div>
                    </div>
                    <div class="col-sm-6 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span class="titleColor">Submitted @: </span>
                            <span class="contentColor">` + value.strSubmittedDateFormatted + ` EST</span>
                        </div>
                    </div>
                    
                    <div class="col-sm sinkCol">
                        <button id="tooltip" class="submissionButtons" type="button" style="display:` + deleteDisplay + `" onclick="deleteSubmission('` + mode + `','` + value.iUserID + `','` + value.iSubmissionID + `')">
                            Delete
                            <span id="tooltiptext">Delete your submission</span>
                        </button>
                    </div>
                    <div class="col-sm sinkCol">
                        <button id="tooltip" class="submissionButtons" type="button" onclick="searchFromSubmission('` + value.strGameName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strTrackName + `', '` + value.strGameModeName + `')">
                            Search
                            <span id="tooltiptext">Search game + game mode</span>
                        </button>
                    </div>
                    
                
                </div>
                <div class="row">
                    <div class="col-sm-3 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span id="tooltip" onclick="searchFromSubmission('` + value.strGameName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `')">
                                <span class="titleColor">Game: </span>
                                <span class="contentColor">` + value.strGameName + `</span>
                                <span id="tooltiptext">Search Game</span>
                            </span>
                            
                        </div>
                    </div>
                    <div class="col-sm-3 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span id="tooltip" onclick="searchFromSubmission('` + `` + `', '` + value.strPlatformName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `')">
                                <span class="titleColor">Platform: </span>
                                <span class="contentColor">` + value.strPlatformName + `</span>
                                <span id="tooltiptext">Search Platform</span>
                            </span>
                        
                        </div>
                    </div>
                    <div class="col-sm-3 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span id="tooltip" onclick="searchFromSubmission('` + `` + `', '` + `` + `', '` + `` + `', '` + value.strVehicleName + `', '` + `` + `', '` + `` + `')">
                                <span class="titleColor">Vehicle: </span>
                                <span class="contentColor">` + value.strVehicleName + `</span>
                                <span id="tooltiptext">Search Vehicle</span>
                            </span>
                            
                        </div>
                    </div>
                    <div class="col-sm-3 textLeftAlign sinkCol">
                        <div class="sinkDiv">                            
                            <span class="titleColor">YT URL: </span>
                            <span class="contentColor">` + value.strProofYTURL + `</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-3">game image</div>
                    <div class="col-sm-6">
                        <div class="row">
                            <div class="col-sm-6 textLeftAlign sinkCol">
                                <div class="sinkDiv">
                                    <span id="tooltip" onclick="searchFromSubmission('` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strTrackName + `', '` + `` + `')">
                                        <span class="titleColor">Track: </span>
                                        <span class="contentColor">` + value.strTrackName + `</span>
                                        <span id="tooltiptext">Search Track</span>
                                    </span>                                    

                                </div>
                            </div>
                            <div class="col-sm-6 textLeftAlign sinkCol">
                                <div class="sinkDiv">
                                    <span id="tooltip" onclick="searchFromSubmission('` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strGameModeName + `')">
                                        <span class="titleColor">Game mode: </span>
                                        <span class="contentColor">` + value.strGameModeName + `</span>
                                        <span id="tooltiptext">Search Game mode</span>
                                    </span>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 textLeftAlign sinkCol">
                                <div class="sinkDiv">
                                    <span class="titleColor">Full Time: </span>
                                    <span class="contentColor">` + value.strFullTime + `</span>
                                </div>
                            </div>
                            <div class="col-sm-6 textLeftAlign sinkCol">
                                <div class="sinkDiv">
                                    <span class="titleColor">Best Lap: </span>
                                    <span class="contentColor">` + value.strBestLap + `</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3">`
                        if (value.strProofYTURL == "")
                        {
                            html_section += `<img id="img_YT_prev" class="img_center" alt="YT prev">`;
                        }
                        else
                        {
                            url = "https://www.youtube.com/embed/" + getId(value.strProofYTURL);
                            html_section += `<iframe width="100%" height="100%" title="YouTube video player" frameborder="0" allowfullscreen src="` + url + `"></iframe>`;
                        }
            html_section +=
                    `</div>
                </div>
                <div class="row">
                    <div class="col-sm-12 textLeftAlign sinkCol">
                        <div class="sinkDiv">
                            <span class="titleColor">Description:</span>
                            <br>
                            <span class="contentColor">` + value.strDesc + `</span>
                        </div>
                    </div>
                </div>
                
            </div>
            <br>`;
        });                
    }
    else
    {
        html_section += 
        `<div id="submission_col_container" class="container">
            <div class="row">
                <div class="col-sm submitTitles">No submissions so far!</div>
            </div>
        </div>
        <br>`;
    }

    html_section += 
    `</div>
        <div class="col-sm-1"></div>
    </div>`;

    return html_section;
}


function build_comments() {

    var comment_rows = document.getElementById("comment_rows");

    if(!comment_rows)
    {
        return;
    }

    var html_comments = "Hello!<br>Nice time!<br>I beat it.";

    $("#comment_rows").html(html_comments);   // jQuery

}


function navbar_active(page_type) {
    $( ".nav-item" ).each( function() {  
        
        $( this ).removeClass("active");

        if ($( this ).children('a').text() == page_type ) {
            $( this ).addClass("active");
        }
        
    });
}


function enforce_min_max(evt) {
    
    var value = Number(evt.currentTarget.value);
    var min = Number(evt.currentTarget.min_limit);
    var max = Number(evt.currentTarget.max_limit);
    
    if (value != null ) {
        if (value < min) {            
            evt.currentTarget.value = min;
        }
        else if (max != -1 && value > max) {
            evt.currentTarget.value = max;
        }
    }
}

const inputHandler = function(e) {
    
    console.log(e.target.value);
}


function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}


function displayYTPrev(evt) {
    url = evt.currentTarget.value;
    if (url == "") {
        document.getElementById("img_YT_prev").style.display = ""; 
        document.getElementById("iframe_YTvid").style.display = "none"; 
    }
    else
    {
        url = "https://www.youtube.com/embed/" + getId(url);
        //alert(url);
        document.getElementById("img_YT_prev").style.display = "none"; 
        document.getElementById("iframe_YTvid").style.display = ""; 
        document.getElementById("iframe_YTvid").src = url;
    }
     
}


function validate_record_submission() {

    document.getElementById("submission_msg").style.color = "red";

    var sub_game = document.getElementById("txt_submit_game").value.trim();
    var sub_platform = document.getElementById("txt_submit_platform").value.trim();
    var sub_vehicle = document.getElementById("txt_submit_vehicle").value.trim();
    var sub_YTURL = document.getElementById("txt_YT_URL").value.trim();
    var sub_track = document.getElementById("txt_submit_track").value.trim();
    var sub_gamemode = document.getElementById("txt_submit_gamemode").value.trim();
    var sub_fullHH = document.getElementById("in_submit_fulltime_HH").value.trim();
    var sub_fullMM = document.getElementById("in_submit_fulltime_MM").value.trim();
    var sub_fullSS = document.getElementById("in_submit_fulltime_SS").value.trim();
    var sub_fullsss= document.getElementById("in_submit_fulltime_sss").value.trim();
    var sub_lapHH = document.getElementById("in_submit_bestlaptime_HH").value.trim();
    var sub_lapMM = document.getElementById("in_submit_bestlaptime_MM").value.trim();
    var sub_lapSS = document.getElementById("in_submit_bestlaptime_SS").value.trim();
    var sub_lapsss = document.getElementById("in_submit_bestlaptime_sss").value.trim();
    var sub_desc = document.getElementById("ta_submit_desc").value.trim();

    const msg_sumbit = document.getElementById("submission_msg");

    if(sub_game == '')
    {
        msg_sumbit.textContent = "Please enter a game!";
        document.getElementById("txt_submit_game").focus;
    }
    else if(sub_platform == '')
    {
        msg_sumbit.textContent = "Please enter a platform!";
        document.getElementById("txt_submit_platform").focus;
    }
    else if(sub_vehicle == '')
    {
        msg_sumbit.textContent = "Please enter a vehicle!";
        document.getElementById("txt_submit_vehicle").focus;
    }
    else if(sub_track == '')
    {
        msg_sumbit.textContent = "Please enter a track!";
        document.getElementById("txt_submit_track").focus;
    }
    else if(sub_gamemode == '')
    {
        msg_sumbit.textContent = "Please enter a gamemode!";
        document.getElementById("txt_submit_gamemode").focus;
    }
    else if(sub_fullHH == '')
    {
        msg_sumbit.textContent = "Please enter a full time (HH) or 0!";
        document.getElementById("in_submit_fulltime_HH").focus;
    }
    else if(sub_fullMM == '')
    {
        msg_sumbit.textContent = "Please enter a full time (MM) or 0!";
        document.getElementById("in_submit_fulltime_MM").focus;
    }
    else if(sub_fullSS == '')
    {
        msg_sumbit.textContent = "Please enter a full time (SS) or 0!";
        document.getElementById("in_submit_fulltime_SS").focus;
    }
    else if(sub_fullsss == '')
    {
        msg_sumbit.textContent = "Please enter a full time (sss) or 0!";
        document.getElementById("in_submit_fulltime_sss").focus;
    }
    else {
        // all required fields were completed.
        const obj = {game: sub_game, platform: sub_platform, vehicle: sub_vehicle, YTURL: sub_YTURL, track: sub_track, gamemode: sub_gamemode, fulltime_HH: sub_fullHH, 
                    fulltime_MM: sub_fullMM, fulltime_SS: sub_fullSS, fulltime_sss: sub_fullsss, laptime_HH: sub_lapHH, laptime_MM: sub_lapMM, laptime_SS: sub_lapSS,
                    laptime_sss: sub_lapsss, desc: sub_desc};
        const myJSON = JSON.stringify(obj);

        // FUNCTION to submit submission
        $.ajax({
            url: "/submit_record",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: myJSON
        }).done(function(response) {
            if(response["status"] = "GOOD") {
                //window.location.href = response.redirect;

                document.getElementById("txt_submit_game").value = "";
                document.getElementById("txt_submit_platform").value = "";
                document.getElementById("txt_submit_vehicle").value = "";
                document.getElementById("txt_YT_URL").value = "";
                document.getElementById("txt_submit_track").value = "";
                document.getElementById("txt_submit_gamemode").value = "";
                document.getElementById("in_submit_fulltime_HH").value = "";
                document.getElementById("in_submit_fulltime_MM").value = "";
                document.getElementById("in_submit_fulltime_SS").value = "";
                document.getElementById("in_submit_fulltime_sss").value = "";
                document.getElementById("in_submit_bestlaptime_HH").value = "";
                document.getElementById("in_submit_bestlaptime_MM").value = "";
                document.getElementById("in_submit_bestlaptime_SS").value = "";
                document.getElementById("in_submit_bestlaptime_sss").value = "";
                document.getElementById("ta_submit_desc").value = "";

                msg_sumbit.style.color = "green";
                msg_sumbit.textContent = response["message"];   
                
                topFunction();
            }
            else
            {
                msg_sumbit.textContent = response["message"];
            }            
        }).fail(function(response) {
            msg_sumbit.textContent = 'Failure, dev has low IQ.';
        });
    }

    return false;
}

/*
async function searchGameListener(evt) {
    //console.log(evt.currentTarget.value);
    let response = await fetch('/searchGameSuggestions?q=' + evt.currentTarget.value);
    let suggestions = await response.json();
    //console.log(suggestions);
    let html = '';
    for (let id in suggestions) {
        let optionVal = suggestions[id].strGameName.replace('<', '&lt;').replace('&', '&amp;');
        // <option value="game">
        html += '<option value="' + optionVal + '">';
    }
    //console.log(html);
    document.querySelector('#list_game').innerHTML = html;
}
*/


async function searchSuggestionsListener(evt) {
    //console.log(evt.currentTarget.value); // input value in the field
    //currSearchField
    //
    //console.log("hello");

    let searchField = evt.currentTarget.currSearchField;
    let dbTable = evt.currentTarget.currDbTable;
    let dbColName = evt.currentTarget.currDBColName;
    let userSearchTerm = evt.currentTarget.value
    
    const obj = {table: dbTable, column: dbColName, userSearch: userSearchTerm};
    const myJSON = JSON.stringify(obj);
    //console.log(myJSON);

    $.ajax({
        url: "/searchSuggestions",
        type: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: myJSON
    }).done(function(response) {
        let suggestions = response;
        //console.log(suggestions);
        let html = '';
        //html += '<option value="existing">';

        for (let id in suggestions) {

            let optionVal = suggestions[id][dbColName].replace('<', '&lt;').replace('&', '&amp;');
            // <option value="game">
            html += '<option value="' + optionVal + '">';
        }
        //console.log(html);
        let idList = '#list_' + searchField;
        //console.log(idList);
        document.querySelector(idList).innerHTML = html;
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
    
}


function searchFromSubmission(gameName, platformName, displayName, vehicleName, trackName, gameModeName) {

    // get user id if logged in
    // session["user_id"]
    var dictParams = {  "callbackType":"search_from_sub",
                        "mode": "search_from_sub",
                        "strGameName": gameName.trim(),
                        "strPlatformName": platformName.trim(),
                        "strDisplayName": displayName.trim(),
                        "strVehicleName": vehicleName.trim(),
                        "strTrackName": trackName.trim(),
                        "strGameModeName": gameModeName.trim()
                    };

    getUserID(dictParams, searchInitiate);
    // /get user id if logged in
}

/*
function searchFromSubmissionInitiate(user_id, game, track, game_mode) {
    let mode = "Search";

    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;

    var strGame = game;
    var strPlatform = platform;
    var strDisplayName = displayName;
    var strVehicleName = vehicleName;
    var strTrack = track;
    var strGameMode = game_mode;

    const myJSON = JSON.stringify({"mode":mode,
                    "strGameName":strGame,
                    "strPlatformName":strPlatform,
                    "strDisplayName":strDisplayName,
                    "strVehicleName":strVehicleName,
                    "strTrackName":strTrack,
                    "strGameModeName":strGameMode
                    });

    $.ajax({
        url: "/populate_submissions_search",
        type: "POST",
        data: {search_json:myJSON}
    }).done(function(response) {

        nav_search_JS();
        document.getElementById("search_game").value = strGame;
        document.getElementById("search_platform").value = strPlatform;
        document.getElementById("search_display_name").value = strDisplayName;
        document.getElementById("search_vehicle_name").value = strVehicleName;
        document.getElementById("search_track").value = strTrack;
        document.getElementById("search_game_mode").value = strGameMode;

        $('#submissions_section').html(build_submission_section(response, mode, user_id));
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
}
*/


function deleteSubmission(mode, owner, submission_id) {
    // get user id if logged in
    // session["user_id"]
    var dictParams = {  "callbackType": "delete_sub",
                        "mode": mode,
                        "owner": owner,
                        "submission_id": submission_id
                    };

    getUserID(dictParams, deleteSubmissionInitiate);
    // /get user id if logged in
}


function deleteSubmissionInitiate(mode, user_id, owner, submission_id) {
    if (owner != user_id)
    {
        alert("This submission is not yours to delete!");
        return;
    }
    
    var submission_id = submission_id.trim();

    const myJSON = JSON.stringify({"user_id":user_id, "submission_id":submission_id});

    $.ajax({
        url: "/deleteSubmission",
        type: "POST",
        data: {delete_json:myJSON}
        }).done(function(response) {
            if (response["status"] == "ERROR")
            {
                alert(response["message"]);
            }
            else
            {   
                search(mode);

                topFunction();

                alert(response["message"]);
            }
        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
    });
}


function getUserID(dictParams, myCallback) {
    $.ajax({
        type:"post",
        url:"/getSessionUserId",
        data:{}
    }).done(function(response) {
        if(dictParams["callbackType"] == "search") 
        {
            myCallback(dictParams["mode"], response["user_id"], "");
        }
        else if (dictParams["callbackType"] == "search_from_sub")
        {
            myCallback(dictParams["callbackType"], response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "delete_sub")
        {
            myCallback(dictParams["mode"], response["user_id"], dictParams["owner"], dictParams["submission_id"]);
        }
        else
        {
            alert("Error 100");
        }
        
    }).fail(function(response) {
        alert("Error 101");
    });

}


function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


$( document ).ready(function() {

    //console.log( "ready!" );
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;
    //console.log(page_type);
    // show if page type = "search"
    show_search_section(page_type);

    // /show if page type = "search"

    // load default submissions
    var submissions_section = document.getElementById("submissions_section");
    
    if(submissions_section && page_type == "Profile") {
        search("Profile");
    }
    else if (submissions_section)
    {
        search("Default");
    }
    // /load default submissions

    // load comment section
    var comment_rows = document.getElementById("comment_rows");
    if(comment_rows) {
        build_comments();
    }
    // /load comment section

    // navbar active
        // nav-item -child-> nav-link
    /*
    $(".nav-item").bind("click", function(event) {
        event.preventDefault();
        var clickedItem = $( this );
        $( ".nav-item" ).each( function() {
            $( this ).removeClass("active");
        });
        clickedItem.addClass("active");
        
    });
    */
    navbar_active(page_type);
    // /navbar active

    // submission time min and max

    min_HH_MM_SS_sss = 0;
    max_MM_SS = 59;

    max_sss = 999;

    // Full time hours
    const in_submit_fulltime_HH = document.getElementById("in_submit_fulltime_HH") == null ? null : document.getElementById("in_submit_fulltime_HH");
    if (in_submit_fulltime_HH != null) {
        in_submit_fulltime_HH.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_fulltime_HH.min_limit = min_HH_MM_SS_sss;
        in_submit_fulltime_HH.max_limit = -1;
        //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
    }

    // Full time minutes
    const in_submit_fulltime_MM = document.getElementById("in_submit_fulltime_MM") == null ? null : document.getElementById("in_submit_fulltime_MM");
    if (in_submit_fulltime_MM != null) {
        in_submit_fulltime_MM.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_fulltime_MM.min_limit = min_HH_MM_SS_sss;
        in_submit_fulltime_MM.max_limit = max_MM_SS;
        //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
    }

    const in_submit_fulltime_SS = document.getElementById("in_submit_fulltime_SS") == null ? null : document.getElementById("in_submit_fulltime_SS");
    if (in_submit_fulltime_SS != null) {
        in_submit_fulltime_SS.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_fulltime_SS.min_limit = min_HH_MM_SS_sss;
        in_submit_fulltime_SS.max_limit = max_MM_SS;
    }

    const in_submit_fulltime_sss = document.getElementById("in_submit_fulltime_sss") == null ? null : document.getElementById("in_submit_fulltime_sss");
    if (in_submit_fulltime_sss != null) {
        in_submit_fulltime_sss.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_fulltime_sss.min_limit = min_HH_MM_SS_sss;
        in_submit_fulltime_sss.max_limit = max_sss;
    }

    
    // Full time hours
    const in_submit_bestlaptime_HH = document.getElementById("in_submit_bestlaptime_HH") == null ? null : document.getElementById("in_submit_bestlaptime_HH");
    if (in_submit_bestlaptime_HH != null) {
        in_submit_bestlaptime_HH.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_bestlaptime_HH.min_limit = min_HH_MM_SS_sss;
        in_submit_bestlaptime_HH.max_limit = -1;
        //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
    }

    // Full time minutes
    const in_submit_bestlaptime_MM = document.getElementById("in_submit_bestlaptime_MM") == null ? null : document.getElementById("in_submit_bestlaptime_MM");
    if (in_submit_bestlaptime_MM != null) {
        in_submit_bestlaptime_MM.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_bestlaptime_MM.min_limit = min_HH_MM_SS_sss;
        in_submit_bestlaptime_MM.max_limit = max_MM_SS;
        //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
    }

    const in_submit_bestlaptime_SS = document.getElementById("in_submit_bestlaptime_SS") == null ? null : document.getElementById("in_submit_bestlaptime_SS");
    if (in_submit_bestlaptime_SS != null) {
        in_submit_bestlaptime_SS.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_bestlaptime_SS.min_limit = min_HH_MM_SS_sss;
        in_submit_bestlaptime_SS.max_limit = max_MM_SS;
    }

    const in_submit_bestlaptime_sss = document.getElementById("in_submit_bestlaptime_sss") == null ? null : document.getElementById("in_submit_bestlaptime_sss");
    if (in_submit_bestlaptime_sss != null) {
        in_submit_bestlaptime_sss.addEventListener('input', enforce_min_max); //inputHandler);
        in_submit_bestlaptime_sss.min_limit = min_HH_MM_SS_sss;
        in_submit_bestlaptime_sss.max_limit = max_sss;
    }

    // /submissiontime min and max

    const txt_YT_URL = document.getElementById("txt_YT_URL") == null ? null : document.getElementById("txt_YT_URL");
    if (txt_YT_URL != null) {
        txt_YT_URL.addEventListener('change', displayYTPrev); //inputHandler);
    }

    
    // for search field AND submit field suggestions
    var dictSearchFields = {
        "game":
            {
                "table":"tblGames",
                "dbColName":"strGameName",
                "inputId":"search_game"
            },
        "platform":
            {
                "table":"tblPlatforms",
                "dbColName":"strPlatformName",
                "inputId":"search_platform"
            },
        "display_name":
            {
                "table":"tblUsers",
                "dbColName":"strDisplayName",
                "inputId":"search_display_name"
            },
        "vehicle":
            {
                "table":"tblVehicles",
                "dbColName":"strVehicleName",
                "inputId":"search_vehicle"
            },
        "track":
            {
                "table":"tblTracks",
                "dbColName":"strTrackName",
                "inputId":"search_track"
            },
        "game_mode":
            {
                "table":"tblGameMode",
                "dbColName":"strGameModeName",
                "inputId":"search_game_mode"
            },
        "submitGame":
            {
                "table":"tblGames",
                "dbColName":"strGameName",
                "inputId":"txt_submit_game"
            },
        "submitPlatform":
            {
                "table":"tblPlatforms",
                "dbColName":"strPlatformName",
                "inputId":"txt_submit_platform"
            },
        "submitVehicle":
            {
                "table":"tblVehicles",
                "dbColName":"strVehicleName",
                "inputId":"txt_submit_vehicle"
            },
        "submitTrack":
            {
                "table":"tblTracks",
                "dbColName":"strTrackName",
                "inputId":"txt_submit_track"
            },
        "submitGameMode":
            {
                "table":"tblGameMode",
                "dbColName":"strGameModeName",
                "inputId":"txt_submit_gamemode"
            }
    };

    var arrSearchVars = [];
    let i = 0;

    for (const key of Object.keys(dictSearchFields))
    {
        /*
        console.log("====");
        console.log(key);
        console.log(dictSearchFields[key]["table"]);
        console.log(dictSearchFields[key]["dbColName"]);
        console.log(dictSearchFields[key]["inputId"]);
        */
        /*
        const inputSearchField = document.getElementById('search_game');
        inputSearchField.addEventListener('input', searchSuggestionsListener);
        inputSearchField.currSearchField = 'key';
        inputSearchField.currDBColName = dictSearchFields[key]["dbColName"];
        */
        arrSearchVars[i] = (document.getElementById(dictSearchFields[key]["inputId"]) == null) ? '':document.getElementById(dictSearchFields[key]["inputId"]);
        if (arrSearchVars[i] == '')
        {
            continue;
        }

        arrSearchVars[i].addEventListener('input', searchSuggestionsListener);
        arrSearchVars[i].addEventListener('focus', searchSuggestionsListener);
        arrSearchVars[i].currSearchField = key;
        arrSearchVars[i].currDbTable = dictSearchFields[key]["table"];
        arrSearchVars[i].currDBColName = dictSearchFields[key]["dbColName"];

        i ++;
    }

    // bootstrap v5 +, enable tooltip manually
    // for pages with scroll, it causes "javascript added non-passive event listener to a scroll-blocking" error
    /*
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    */



    
});


/*
<div class="row">
                <div class="borderRed col-sm-2">col-sm-2</div>
                <div class="borderRed col-sm-8">
                    Latest 10 Submissions<br>

                    {% if recordPreview %}
                        {% for record in recordPreview %}
                    <div class="borderRed container">
                        <div class="row">
                            <!--row for Date, game, platform, and Search/Delete/Edit buttons-->
                            container header
                        </div>
                        <div class="row">
                            <div class="borderBlue col-sm-2">game image</div>
                            <div class="borderBlue col-sm-8">
                                <div class="row">
                                    <div class="borderBlue col-sm">{{ record.strDisplayName }}</div>
                                    <div class="borderBlue col-sm">{{ record.strVehicle }}</div>
                                </div>
                                <div class="row">
                                    <div class="borderBlue col-sm">track</div>
                                    <div class="borderBlue col-sm">game mode</div>
                                </div>
                                <div class="row">
                                    <div class="borderBlue col-sm">full time</div>
                                    <div class="borderBlue col-sm">best lap</div>
                                </div>
                            </div>
                            <div class="borderBlue col-sm-2">proof preview</div>
                        </div>
                    </div>
                        {% endfor %}
                    {% else %}
                    <div class="borderRed container">
                        <div class="row">
                            <div class="borderBlue col-sm">No submissions so far!</div>
                        </div>
                    </div>
                    {% endif %}
                </div>
                <div class="borderRed col-sm-2">col-sm-2</div>
            </div>
*/