// Variables for submission sorting.
let sort_asc = false;
let curr_sort_col, submission_data, mode, curr_page, max_pages;

curr_page = 1;
const page_size = 3;

let btnSortBySubmittedTimeTextBase = "Submitted @";
let btnSortByFullTimeTextBase = "Full time"
let btnSortBySubmittedTimeText = "Submitted @";
let btnSortByFullTimeText = "Full time";


/*
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
*/


/*
Process the Register operation to register a new user.
Params: 
    > N/A
Return: 
    > boolean false: So button does refresh the page.
*/
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
    else if(data_password != data_password_again)
    {
        msg_register.textContent = "Passwords do not match!";
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
                alert("Registration successful!")
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


/*
Get the current 'mode' which specifies the Page and also sets the global variable 'mode' with the Page.
Params: 
    > N/A
Return: 
    > String mode: Page mode
*/
function getPageMode() {
    var search_section = document.getElementById("search_section");
    var page = document.getElementById("page_type").value;

    if(search_section && page == "search") {
        mode = "search";
    }
    else if (page == "profile")
    {
        mode = "profile";
    }
    else
    {
        mode = "home";
    }

    return mode;
}


/*
Show or hide the search parameter container.
Params: 
    > String page: Destination page.
Return:
    > int 0: Search section is toggled to display.
    > int 1: Search section is toggled to not display.
    > int -1: No display changed.
*/
function show_search_section(page) {
    var search_section = document.getElementById("search_section");

    if(search_section && page == "search")
    {
        document.getElementById("search_section").style.display = "block";   
        document.getElementById("page_type").value = "search"
        //console.log(document.getElementById("page_type").value);
        return 0;
    }
    else if (search_section && page == "home")
    {
        document.getElementById("search_section").style.display = "none";   
        document.getElementById("page_type").value = "home"
        return 1;
    }
    else
    {
        return -1;
    }
}


/*
Navbar redirect to the "Home" page.
*/
function nav_home_JS() {
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;

    if(page_type == "search")
    {
        show_search_section("home");
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

    search("default");

}


/*
Navbar redirect to the "Search" page.
*/
function nav_search_JS() {
    topFunction();
    var ret = show_search_section("search");

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


/*
Receive the search parameters from the "Profile" page and then redirect to the "Search" page.
Params:
    > Dictionary search_params: Search parameter values from the "Profile" page.
Return:
    > N/A
*/
function nav_search_from_profile(search_params) {
    topFunction();
    var ret = show_search_section("search");

    search_params = JSON.stringify(search_params);

    if(ret != 0)
    {
        $.ajax({
            url: "/nav_search_from_profile",
            type: "POST",
            dataType: 'json',
            contentType: 'application/json',
            data: search_params
        }).done(function(response) {
            window.location.href = response.redirect;
        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
        });
    }
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;
    navbar_active(page_type);
}


/*
Navbar redirect to the "Profile" page.
*/
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


/*
Navbar redirect to the "Submit" page.
*/
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


/*
Navbar redirect to the "User settings" page.
*/
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


/*
Navbar redirect to the "Register" page.
*/
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


/*
Navbar redirect to the "Log In" page.
*/
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


/*
Process the Log In operation to attempt to log in the user.
*/
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


/*
Starting function for processing Search operation. Calls a function to get the current user ID and then calls the callback function searchInitiate().
Params:
    > mode: Specifies the "mode" (i.e "default, profile") to determine the search query to populate the submission section.
Return:
    > N/A
*/
function search(mode) {

    curr_sort_col = "";
    btnSortByFullTimeText = btnSortByFullTimeTextBase;
    btnSortBySubmittedTimeText = btnSortBySubmittedTimeTextBase;

    // get user id if logged in
    // session["user_id"]
    var dictParams = {"callbackType":"search",
                        "mode":mode};

    // Using callbacks to ensure order of AJAX calls. Need to verify the current user id then proceed to building submission section. For this context, to know which submissions belong to the current logged in user.
    getUserID(dictParams, searchInitiate);
    // /get user id if logged in
}


/*
Populate the JSON with search parameters and related information, retrieve the search results, and then call function build_submission_section(...) to populate the submission container.
Params:
    > mode: Specifies the "mode" (i.e "default, profile") to determine the search query to populate the submission section.
    > user_id: If logged in, get the user ID.
    > optionalDict: If the search parameter values are from a different source other than the search parameter container fields.
Return:
    > N/A
*/
function searchInitiate(mode, user_id, optionalDict) {
    // submission results
    var submissions_section = document.getElementById("submissions_section");
    
    if(!submissions_section)
    {
        return;
    }

    if(mode == "search")
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
    else if(mode == "profile")
    {
        search_params = JSON.stringify({"mode":mode});
    }
    else if(mode == "search_from_sub")
    {
        search_params = JSON.stringify(optionalDict);
        nav_search_JS();
    }
    else if(mode == "search_from_sub_profile")
    {
        search_params = JSON.stringify(optionalDict);
        
    }
    else
    {
        search_params = JSON.stringify({"mode":"default"});

        var searchContainer = document.getElementById("search_col_container");

        if (searchContainer) {
            document.getElementById("search_game").value = "";
            document.getElementById("search_platform").value = "";
            document.getElementById("search_display_name").value = "";
            document.getElementById("search_vehicle").value = "";
            document.getElementById("search_track").value = "";
            document.getElementById("search_game_mode").value = "";
        }

    }

    //console.log(search_params);

    $.ajax({
        type:"post",
        url:"/populate_submissions_search",
        data:{search_json:search_params}
    }).done(function(response) {
        //console.log(response);
        //window.location.href = response.redirect;
        submission_data = response;
        //console.log(typeof(submission_data));
        //console.log(submission_data);
        mode = mode;

        curr_page = 1;
        max_pages = math.ceil(submission_data.length / page_size);

        if (mode == "search_from_sub" || mode == "search_from_sub_profile")
        {
            document.getElementById("search_game").value = optionalDict["strGameName"];
            document.getElementById("search_platform").value = optionalDict["strPlatformName"];
            document.getElementById("search_display_name").value = optionalDict["strDisplayName"];
            document.getElementById("search_vehicle").value = optionalDict["strVehicleName"];
            document.getElementById("search_track").value = optionalDict["strTrackName"];
            document.getElementById("search_game_mode").value = optionalDict["strGameModeName"];
        }

        //$('#submissions_section').html(build_submission_section(response, mode, user_id));
        build_submission_section(response, mode, user_id);
    }).fail(function(response) {
        alert('Failure, dev has low IQ.');
    });
    // /submission results
}


/*
Sort the array of dictionaries by the desired filter.
Params:
    > String btnId: The html id of the filter's button.
    > String target_col: Target key of each of the dictionaries in the array to sort by.
Return:
    > N/A
*/
function sortBy(btnId, target_col) {

    // if same col selected, flip the sort order
    if (curr_sort_col === target_col) {
        sort_asc = !sort_asc;
    }
    curr_sort_col = target_col;
    
    if (btnId == "btnSortBySubmittedTime")
    {
        btnSortBySubmittedTimeText = btnSortBySubmittedTimeTextBase.concat(" (", (sort_asc)?'asc':'desc', ")");
        btnSortByFullTimeText = btnSortByFullTimeTextBase;
    }
    else if (btnId == "btnSortByFullTime")
    {
        btnSortBySubmittedTimeText = btnSortBySubmittedTimeTextBase;
        btnSortByFullTimeText = btnSortByFullTimeTextBase.concat(" (", (sort_asc)?'asc':'desc', ")");
    }

    submission_data.sort((a, b) => {
        if(a[target_col] < b[target_col]) return sort_asc?-1:1;
        if(a[target_col] > b[target_col]) return sort_asc?1:-1;
        return 0;
    });

    request_render_submission_data();
}


/*
Append the post-fix to create ordinal numbers.
Params:
    > number iStanding: Raw number
Return:
    > String for the complete ordinal number (i.e. '1st')
*/
function setStandingPostFix(iStanding) {
    //console.log(typeof(iStanding));
    let ord = 'th';

    if (iStanding % 10 == 1 && iStanding % 100 != 11)
    {
        ord = 'st';
    }
    else if (iStanding % 10 == 2 && iStanding % 100 != 12)
    {
        ord = 'nd';
    }
    else if (iStanding % 10 == 3 && iStanding % 100 != 13)
    {
        ord = 'rd';
    }

    return iStanding.toString() + ord;
}


/*
Populate the html contents of the submission section.
Params:
    > Arr results: The array of dictionaries that contains the submission results.
    > String mode: Specifies the "mode" (i.e "default, profile") to determine the search query to populate the submission section.
    > user_id: If logged in, get the current user ID.
Return:
    > N/A
*/
function build_submission_section(results, mode, user_id) {
    //console.log(results);

    let submission_section = $("#submissions_section");
    let curr_page_type = document.getElementById("page_type").value;
    
    var html_section =
    `<div class="row">
        <div class="col-sm-1"></div>
        <div id="submission_col" class="col-sm-10">
            <div id="subtitle_div">
                <span id="subtitle_span">`;
    
    if (mode == "search" || mode == "search_from_sub" || mode == "search_from_sub_profile")
    {
        html_section +=
                    `Search results`;       
    }
    else if (mode == "profile")
    {
        html_section +=
                    `Your submissions`;       
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

    html_section +=
            `<div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-2">
                    <span id="subtitle_span">Sort by: </span>
                </div>
                <div class="col-sm-3">
                    <button id="btnSortBySubmittedTime" class="` + ((curr_sort_col == 'strSubmittedDate')?`submissionButtons`:`sortByBtnInactive`) + `" type="button" onclick="sortBy('btnSortBySubmittedTime', 'strSubmittedDate')">` + btnSortBySubmittedTimeText + `</button>
                </div>
                <div class="col-sm-3">
                    <button id="btnSortByFullTime" class="` + ((curr_sort_col == 'strFullTime')?`submissionButtons`:`sortByBtnInactive`) + `" type="button" onclick="sortBy('btnSortByFullTime', 'strFullTime')">` + btnSortByFullTimeText + `</button>
                </div>
            </div>
            <br>`;

    //searchFromSubmission('` + value.strGameName + `', '` + value.strPlatformName + `', '` + value.strDisplayName + `', '` + value.strVehicleName + `', '` + value.strTrackName + `', '` + value.strGameModeName + `')
    if(results != "")
    {
        //$.each(results, function(index, value) {
        submission_data.filter((row, index) => {            
            let start = (curr_page - 1) * page_size;
            let end = (curr_page * page_size);
            if(index >= start && index < end) {
                return true;
            }
        }).forEach(
            value => {
                deleteDisplay = (value.iUserID == user_id)?';':'none;';                

                subPlacement = setStandingPostFix(value.iStanding);

                html_section += 
                `<div id="submission_col_container" class="container">
                    <div class="row">
                        <!--row for Date, game, platform, and Search/Delete-->
                        <div class="col-sm-3 textLeftAlign sinkCol">
                            <div class="sinkDiv">
                                <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + `` + `', '` + `` + `', '` + value.strDisplayName + `', '` + `` + `', '` + `` + `', '` + `` + `')">
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
                            <button id="tooltip" class="submissionButtons" type="button" onclick="searchFromSubmission('` + curr_page_type + `', '` + value.strGameName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strTrackName + `', '` + value.strGameModeName + `')">
                                Search
                                <span id="tooltiptext">Search game<br>+ Track<br>+ Game mode</span>
                            </button>
                        </div>
                        
                    
                    </div>
                    <div class="row">
                        <div class="col-sm-3 textLeftAlign sinkCol">
                            <div class="sinkDiv">
                                <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + value.strGameName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `')">
                                    <span class="titleColor">Game: </span>
                                    <span class="contentColor">` + value.strGameName + `</span>
                                    <span id="tooltiptext">Search Game</span>
                                </span>
                                
                            </div>
                        </div>
                        <div class="col-sm-3 textLeftAlign sinkCol">
                            <div class="sinkDiv">
                                <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + `` + `', '` + value.strPlatformName + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `')">
                                    <span class="titleColor">Platform: </span>
                                    <span class="contentColor">` + value.strPlatformName + `</span>
                                    <span id="tooltiptext">Search Platform</span>
                                </span>
                            
                            </div>
                        </div>
                        <div class="col-sm-3 textLeftAlign sinkCol">
                            <div class="sinkDiv">
                                <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strVehicleName + `', '` + `` + `', '` + `` + `')">
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
                        <div class="col-sm-9">
                            <div class="row">
                                <div class="col-sm-8 textLeftAlign sinkCol">
                                    <div class="sinkDiv">
                                        <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strTrackName + `', '` + `` + `')">
                                            <span class="titleColor">Track: </span>
                                            <span class="contentColor">` + value.strTrackName + `</span>
                                            <span id="tooltiptext">Search Track</span>
                                        </span>                                    

                                    </div>
                                </div>
                                <div class="col-sm-4 textLeftAlign sinkCol">
                                    <div class="sinkDiv">
                                        <span id="tooltip" class="pointer" onclick="searchFromSubmission('` + curr_page_type + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + `` + `', '` + value.strGameModeName + `')">
                                            <span class="titleColor">Game mode: </span>
                                            <span class="contentColor">` + value.strGameModeName + `</span>
                                            <span id="tooltiptext">Search Game mode</span>
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-8 textLeftAlign sinkCol">
                                    <div class="sinkDiv">
                                        <span class="titleColor">Full Time: </span>
                                        <span class="contentColor">` + value.strFullTime + `</span>
                                        <br>
                                        <span class="titleColor">Placement: </span>
                                        <span class="contentColor">(` + subPlacement + `)</span>
                                        <br>
                                        (based on Game, Track, and Game mode)
                                    </div>
                                </div>
                                <div class="col-sm-4 textLeftAlign sinkCol">
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
        
        html_section +=
            `<div class="row">
                <div class="col-sm-9"></div>
                <div class="col-sm-1 d-flex justify-content-center">
                    <button id="prev_page" ` + ((curr_page != 1)?``:`disabled`) + ` class="` + ((curr_page != 1)?`pageBtnsActive`:`pageBtnsInactive`) + `" type="button" onclick="prev_page()">Prev</button>
                </div>
                <div class="col-sm-1 d-flex justify-content-center">
                    <select id="selPage" name="selPage" class="w-100" onchange="set_curr_page()">`;
                        for (let i = 1; i <= max_pages; i ++)
                        {
                            if (curr_page == i)
                            {
                                html_section += `<option value=` + i + ` selected>` + i + `</option>`;
                            }
                            else {
                                html_section += `<option value=` + i + `>` + i + `</option>`;
                            }
                        }
            html_section +=
                    `</select>
                </div>
                <div class="col-sm-1 d-flex justify-content-center">
                    <button id="next_page" ` + ((curr_page == max_pages)?`disabled`:``) + ` class="` + ((curr_page == max_pages)?`pageBtnsInactive`:`pageBtnsActive`) + `" type="button" onclick="next_page()">Next</button>
                </div>
            </div>
            <br>`;
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

    submission_section.html(html_section)
    //return html_section;
}


/*
Starting point to request to rebuild the submission section after applying a filter to the current submission data without re-querying the db.
Params:
    > N/A
Return:
    > N/A
*/
function request_render_submission_data() {
    mode = getPageMode();

    var dictParams = {"callbackType":"build_submission_section",
                        "mode":mode};
    getUserID(dictParams, build_submission_section);

    //topFunction();
}


/*
Set the current page after the "Prev" button has been clicked.
Params:
    > N/A
Return:
    > N/A
*/
function prev_page() {

    if (curr_page > 1)
    {
        curr_page --;

        request_render_submission_data();

        topFunction();
    }
}


/*
Set the current page after the "Next" button has been clicked.
Params:
    > N/A
Return:
    > N/A
*/
function next_page() {
    if ((curr_page * page_size) < submission_data.length)
    {
        curr_page ++;

        request_render_submission_data();

        topFunction();
    }
}


/*
Set the current page after a value was chosen in the page dropdown.
Params:
    > N/A
Return:
    > N/A
*/
function set_curr_page() {
    curr_page = document.getElementById("selPage").value;

    if (curr_page >= 1 && curr_page <= max_pages)
    {
        mode = getPageMode();

        request_render_submission_data();
    }

    topFunction();
}


/*
function build_comments() {

    var comment_rows = document.getElementById("comment_rows");

    if(!comment_rows)
    {
        return;
    }

    var html_comments = "Hello!<br>Nice time!<br>I beat it.";

    $("#comment_rows").html(html_comments);   // jQuery

}
*/


/*
Add the "active" class to the navbar item that was clicked.
Params:
    > String page_type: The target page.
Return:
    > N/A
*/
function navbar_active(page_type) {
    page_type = page_type.toUpperCase();
    $( ".nav-item" ).each( function() {  
        
        $( this ).removeClass("active");

        if (($( this ).children('a').text()).toUpperCase() == page_type ) {
            $( this ).addClass("active");
        }
        
    });
}


/*
Ensures the value within the input field is within the minimum and maximum limits given.
Params:
    > event object evt: Contains the values; number value (the current value in the input), number min_limit (lower limit for the number), and nuber max_limit (higher limit for the number)
Return:
    > N/A
*/
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

/*
Just a debug event listener function.
*/
const inputHandler = function(e) {
    
    console.log(e.target.value);
}


/*
Given a YouTube URL, convert it to an embedded string.
Params:
    > url: Raw YouTube URL
Return:
    > N/A
*/
function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}


/*
Call a pixabay.com API to get a random image.
Params: 
    > event object evt: Contains the string entered in the "* Game" input on the "Submit" page.
Return:
    > N/A
*/
function displayGameImage(evt) {
    let game_name = evt.currentTarget.value;

    let max_images = 100;

    if (game_name == "") {
        document.getElementById("img_game_cover").setAttribute('src', '/static/images/game_cover_placeholder.png');
        document.getElementById("image_credit").textContent = ""; 
        document.getElementById("image_credit").style.display = "none";
    }
    else
    {
        var API_KEY = '42031889-3bea9610c40ae5e7c3894a8e2';
        // https://pixabay.com/api/docs/
        // not many images for specific games, so just generically pick a random race track image
        var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent('car race track')+"&per_page="+max_images.toString();
        $.getJSON(URL, function(data){
            if (parseInt(data.totalHits) > 0)
            {
                //$.each(data.hits, function(i, hit){ console.log(hit.pageURL); });    
                let image_number = Math.floor(Math.random() * max_images);
                //console.log(image_number.toString());
                //console.log(data.hits[image_number]["largeImageURL"]);
                document.getElementById("img_game_cover").setAttribute('src', data.hits[image_number]["largeImageURL"]);
                document.getElementById("image_credit").textContent = "credit: pixabay.com"
                document.getElementById("image_credit").style.display = "";
            }
        });
    }
}


/*
Set the iframe src to the embedded YouTube URL so that the preview is displayed.
Params:
    > event object evt: Raw YouTube url.
Return:
    > N/A
*/
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


/*
Process the submit submission operation. Check the required fields have values and if all populated attempt to commit to db.
Params:
    > N/A
Return:
    > bool false: So that the button click does not refresh the page.
*/
function validate_record_submission() {

    topFunction();

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
        msg_sumbit.textContent = "Please enter a numeric full time: (HH) or 0!";
        document.getElementById("in_submit_fulltime_HH").focus;
    }
    else if(sub_fullMM == '')
    {
        msg_sumbit.textContent = "Please enter a numeric full time: (MM) or 0!";
        document.getElementById("in_submit_fulltime_MM").focus;
    }
    else if(sub_fullSS == '')
    {
        msg_sumbit.textContent = "Please enter a numeric full time: (SS) or 0!";
        document.getElementById("in_submit_fulltime_SS").focus;
    }
    else if(sub_fullsss == '')
    {
        msg_sumbit.textContent = "Please enter a numeric full time: (sss) or 0!";
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

                document.getElementById("img_game_cover").setAttribute('src', '/static/images/game_cover_placeholder.png');
                document.getElementById("image_credit").textContent = ""; 
                document.getElementById("image_credit").style.display = "none";

                document.getElementById("txt_submit_track").value = "";
                document.getElementById("txt_submit_gamemode").value = "";

                document.getElementById("img_YT_prev").style.display = ""; 
                document.getElementById("iframe_YTvid").style.display = "none"; 

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
                
            }
             
            msg_sumbit.textContent = response["message"];

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


/*
On focus and input on the input field, adjust the suggestions in the drop down select.
Params:
    > event object evt: Contains values to determine the method what suggestions to populate. i.e. Which field is active, the db table to search, column name that contains the suggestion string, relCol for the relational column, suggestion type for if "Submit" or "Search" suggestions, and current value in the input field.
Return:
    > N/A
*/
async function inputSuggestionsListener(evt) {
    //console.log(evt.currentTarget.value); // input value in the field
    //currSearchField
    //
    //console.log("hello");

    let searchField = evt.currentTarget.currSearchField;
    let dbTable = evt.currentTarget.currDbTable;
    let dbColName = evt.currentTarget.currDBColName;
    let dbRelCol = evt.currentTarget.currDbRelCol;
    let suggestionType = evt.currentTarget.currSuggestionType;
    let userSearchTerm = evt.currentTarget.value
    
    const obj = {table: dbTable, column: dbColName, relCol: dbRelCol, userSearch: userSearchTerm, suggestionType: suggestionType};
    const myJSON = JSON.stringify(obj);
    //console.log(myJSON);

    $.ajax({
        url: "/inputSuggestions",
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


/*
Datalist didn't need events, just load the items
Params:
    > Which field is active
    > the db table to search 
    > column name that contains the suggestion string
    > relCol for the relational column
    > suggestion type for if "Submit" or "Search" suggestions
    > current value in the input field.
Return:
    > N/A
*/
function inputSuggestionsLoad(searchField, dbTable, dbColName, dbRelCol, suggestionType, userSearchTerm) {
    
    const obj = {table: dbTable, column: dbColName, relCol: dbRelCol, userSearch: userSearchTerm, suggestionType: suggestionType};
    const myJSON = JSON.stringify(obj);
    //console.log(myJSON);

    $.ajax({
        url: "/inputSuggestions",
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


/*
Starting point to search by a the value of a clicked section of a submission. i.e. Clicked a game "F1 22" and it will populate the submission section with all submissions with game "F1 22".
Params:
    > String curr_page_type: The current page that the submission section is on.
    > String gameName: The value of the "Game" clicked.
    > String platformName: The value of the "Platform" clicked.
    > String displayName: The value of the "Display name" clicked.
    > String vehicleName: The value of the "Vehicle" clicked.
    > String trackName: The value of the "Track" clicked.
    > String gameModeName: The value of the "Game mode" clicked.
Return:
    > N/A
*/
function searchFromSubmission(curr_page_type, gameName, platformName, displayName, vehicleName, trackName, gameModeName) {

    // session["user_id"]
    var dictParams = {  
                        "curr_page_type": curr_page_type,
                        "strGameName": gameName.trim(),
                        "strPlatformName": platformName.trim(),
                        "strDisplayName": displayName.trim(),
                        "strVehicleName": vehicleName.trim(),
                        "strTrackName": trackName.trim(),
                        "strGameModeName": gameModeName.trim()
                    };
    if (curr_page_type == "profile")
    {
        dictParams["callbackType"] = "search_from_sub_profile";
        dictParams["mode"] = "search_from_sub_profile";
        nav_search_from_profile(dictParams); // render home page      
    }
    else
    {
        //console.log("abc");
        //console.log(document.getElementById("search_params").value);
        document.getElementById("search_params").value = "";
        //console.log("def");
        //console.log(document.getElementById("search_params").value);
    
        dictParams["callbackType"] = "search_from_sub";
        dictParams["mode"] = "search_from_sub";
        getUserID(dictParams, searchInitiate);
        
    }
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


/*
Starting point to process the delete submission operation.
Params:
    > String mode: The current mode the submission section is in. i.e. home, profile, search, search_from_sub, and search_from_sub_profile.
    > String owner: The submission's owner user id.
    > String submission_id: The target submission to be deleted.
Return:
    > N/A
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


/*
Process the delete submission operation to remove a submission from the db.
Params:
    > String mode: The current mode the submission section is in. i.e. home, profile, search, search_from_sub, and search_from_sub_profile.
    > String owner: The submission's owner user id.
    > String submission_id: The target submission to be deleted.
Return:
    > N/A
*/
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
                if (getPageMode() == "profile") {
                    getUserProfileStats();
                }

                search(mode);

                topFunction();

                alert(response["message"]);
            }

        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
    });
}


/*
Get the user id of the logged in user for their session, then proceed to the next operation in the form of a callback passed as a parameter.
Params:
    > Dictionary dictParams: Contains values required for the callback function.
    > function object myCallback: function to be called after AJAX done.
Return:
    > N/A
*/
function getUserID(dictParams, myCallback) {
    
    $.ajax({
        type:"post",
        url:"/getSessionUserId",
        data:{}
    }).done(function(response) {
        if (dictParams["callbackType"] == "search") 
        {
            myCallback(dictParams["mode"], response["user_id"], "");
        }
        else if (dictParams["callbackType"] == "search_from_sub")
        {
            myCallback(dictParams["callbackType"], response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "search_from_sub_profile")
        {
            myCallback(dictParams["callbackType"], response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "delete_sub")
        {
            myCallback(dictParams["mode"], response["user_id"], dictParams["owner"], dictParams["submission_id"]);
        }
        else if (dictParams["callbackType"] == "get_user_display_info")
        {
            myCallback(response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "update_user_settings")
        {
            myCallback(response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "get_user_profile_info")
        {
            myCallback(response["user_id"], dictParams);
        }
        else if (dictParams["callbackType"] == "build_submission_section")
        {
            myCallback(submission_data, dictParams["mode"], response["user_id"]);
        }
        else
        {
            alert("Error 100");
        }
        
    }).fail(function(response) {
        alert("Error 101");
    });

}


/*
Scroll to the top of the page.
Params:
    > N/A
Return:
    > N/A
*/
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/*
Starting point to get the logged in user's profile display information. i.e. Profile picture source and display name.
Params:
    > String page_type: The page that will display the profile's display information.
Return:
    > N/A
*/
function getUserProfileDisplayInfo(page_type) {

    var dictParams = {  "callbackType": "get_user_display_info",
                        "page_type": page_type
                    };

    getUserID(dictParams, getUserProfileDisplayInfo_initiate);
}


/*
Process the get user profile's display information operation to display the profile picture and display name.
Params:
    > number user_id: The logged in user id.
    > Dictionary dictParmas: Contains the "page_type" of the page that will display the information.
Return:
    > N/A
*/
function getUserProfileDisplayInfo_initiate(user_id, dictParams) {
    page_type = dictParams["page_type"];

    const myJSON = JSON.stringify({"user_id":user_id});

    // get user profile pic and display name
    $.ajax({
        url: "/getUserProfileDisplayInfo",
        type: "POST",
        data: {json_data:myJSON}
        }).done(function(response) {
            //document.getElementById("idProfilePic").textContent = response["profilePic"];
            //console.log(response);
            //console.log(page_type);
            if (page_type == "settings")
            {                
                if (response["profilePicSrc"] != "")
                {
                    img_profile_pic.setAttribute('src', response["profilePicSrc"]);
                }
                document.getElementById("txt_display_name_change").value = response["displayName"];
            }
            else if (page_type == "profile")
            {
                if (response["profilePicSrc"] != "")
                {
                    img_profile_pic.setAttribute('src', response["profilePicSrc"]);
                }
                document.getElementById("idDisplayName").textContent = response["displayName"];
            }            
        }).fail(function(response) {
            if (page_type == "settings")
            {
                document.getElementById("txt_display_name_change").value = "error";
            }
            else if (page_type == "profile")
            {
                document.getElementById("idDisplayName").textContent = "error";
            }
    });
}


/*
Starting point to get the user's profile statistics of their submissions.
Params:
    > String page_type: Target page.
Return:
    > N/A
*/
function getUserProfileStats(page_type) {
    var dictParams = {  "callbackType": "get_user_profile_info",
                        "page_type": page_type
                    };

    getUserID(dictParams, getUserProfileStats_initiate);
}


/*
Process the get user's profile statistics of their submissions.
Params:
    > number user_id: The logged in user id.
    > Dictionary dictParams: Contains the page_type.
Return:
    > N/A
*/
function getUserProfileStats_initiate(user_id, dictParams) {
    // get number of submissions, most submitted game, most submitted track, most submitted vehicle, and most submitted game mode

    dictParams["user_id"] = user_id;

    const myJSON = JSON.stringify(dictParams);

    $.ajax({
        url: "/getUserProfileStats",
        type: "POST",
        data: {json_data:myJSON}
        }).done(function(response) {
            for (var key in response){
                if (key != "status")
                {
                    document.getElementById(key).textContent = response[key];                
                }
            }
        }).fail(function(response) {
            alert('Failure, dev has low IQ.');
    });
}


/*
function getUserNumOfSubmissions() {
    $.ajax({
        url: "/getUserNumOfSubmissions",
        type: "POST",
        data: {}
        }).done(function(response) {
            document.getElementById("idNumOfSub").textContent = response["message"];
        }).fail(function(response) {
            document.getElementById("idNumOfSub").textContent = "error";
    });
}


function getUserMostSubmittedX(dictProfileFields) {
    
    const myJSON = JSON.stringify(dictProfileFields);
    
    $.ajax({
        url: "/getUserMostSubmittedX",
        type: "POST",
        data: {json_data:myJSON}
        }).done(function(response) {
            //console.log(dictProfileFields["profileElemID"] + " : " + response["message"]);
            document.getElementById(dictProfileFields["profileElemID"]).textContent = response["message"];
        }).fail(function(response) {
            document.getElementById(dictProfileFields["profileElemID"]).textContent = "error";
            //alert('Failure, dev has low IQ.');
    });
}
*/


/*
Process the update user settings operations. i.e. Profile picture, display name, and password.
Params:
    > number user_id: The logged in user id.
    > Dictionary dictParams: Contains the "update_section" the specify which section is to be updated.
Return:
    > bool false: So that the page does not refresh.
*/
function update_user_settings_initiate(user_id, dictParams){

    let user_settings_profile_pic_msg = document.getElementById("user_settings_profile_pic_msg");

    let user_settings_display_name_msg = document.getElementById("user_settings_display_name_msg");

    let user_settings_password_msg = document.getElementById("user_settings_password_msg");
    user_settings_password_msg.style.color = "red";

    dictParams["user_id"] = user_id;

    const myJSON = JSON.stringify(dictParams);
    //console.log(myJSON);

    if (dictParams["update_section"] == "profile_pic")
    {
        var form_data = new FormData($('#frmProfilePic')[0]);
        
        for (const key of Object.keys(dictParams))
        {
            form_data.append(key, dictParams[key]);
        }
        
        $.ajax({
            type: 'POST',
            url: '/updateProfilePic',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false
            }).done(function(response) {
                
                if (response["status"] == "GOOD") {
                    user_settings_profile_pic_msg.style.color = "green";
                    
                    let img_profile_pic = document.getElementById("img_profile_pic");
                    img_profile_pic.setAttribute('src', response["profilePicSrc"]);
                }
                else {
                    user_settings_profile_pic_msg.style.color = "red";
                }
                
                user_settings_profile_pic_msg.textContent = response["message"];
                
            }).fail(function(response) {
                alert('Failure, dev has low IQ.');
            
        });
        
        /*
        
        */
                
    }
    else if (dictParams["update_section"] == "display_name" || dictParams["update_section"] == "password")
    {
        $.ajax({
            url: "/update_user_settings_initiate",
            type: "POST",
            data: {json_data:myJSON}
            }).done(function(response) {
                //console.log(dictParams["update_section"]);
                //console.log(response);

                if (dictParams["update_section"] == "display_name") {
                    if (response["status"] == "GOOD") {
                        user_settings_display_name_msg.style.color = "green";
                    }
                    else {
                        user_settings_display_name_msg.style.color = "red";
                    }

                    user_settings_display_name_msg.textContent = response["message"];
                }
                else if (dictParams["update_section"] == "password") {
                    if (response["status"] == "GOOD") {                    
                    
                        user_settings_password_msg.style.color = "green";
    
                        // clear password inputs on success
                        document.getElementById("old_password").value = "";
                        document.getElementById("new_password").value = "";
                        document.getElementById("confirm_new_password").value = "";
                        
                    }
                    else {
                        user_settings_password_msg.style.color = "red";
                    }

                    user_settings_password_msg.textContent = response["message"];
                }

                //topFunction();

            }).fail(function(response) {
                
                alert('Failure, dev has low IQ.');
            
        });
    }

}


/*
Starting point to process the update user settings operations. i.e. Update the profile picture, display name, and password.
Params:
    > String update_section: Target section that is to be updated.
Return:
    > bool false: So that the page does not refresh.
*/
function update_user_settings(update_section) {

    /*
    Profile pic updates automatically once user chooses an acceptable file. Uh, like file type PNG or JPEG and will auto resize to a set size.
    Display name updates on button click
    Password updates on button click
    */


    var dictParams = {"callbackType":"update_user_settings",
                        "mode":"update_user_settings",
                        "update_section":update_section
                    };
    
    if (update_section == "profile_pic")
    {

        var input_display_pic = document.getElementById("input_display_pic");
        let user_settings_profile_pic_msg = document.getElementById("user_settings_profile_pic_msg");

        // once they choose a file. check file format, resize, and attempt to save file into server. DB columns will save the file name, if same file name
        //  exists, rename it with _+1.ext
        var file = input_display_pic.files[0];
        
        if (file == undefined) {
            user_settings_profile_pic_msg.style.color = "red";
            user_settings_profile_pic_msg.textContent = "Must select a file first!";

            return false;
        }

        var imageType = 'image/*';

        if (file.type.match(imageType)) {
            var reader = new FileReader();
            //console.log("file type good!");
            reader.onload = function(e) {
                
            }
            
            reader.readAsDataURL(file); 

        } else {
            let user_settings_profile_pic_msg = document.getElementById("user_settings_profile_pic_msg");
            user_settings_profile_pic_msg.style.color = "red";
            user_settings_profile_pic_msg.textContent = "File not supported!";

            return false;
        }
        
    }
    else if (update_section == "display_name")
    {
        dictParams["new_display_name"] = document.getElementById("txt_display_name_change").value.trim();

        if (dictParams["new_display_name"] == "") {
            
            let user_settings_profile_pic_msg = document.getElementById("user_settings_display_name_msg");
            user_settings_profile_pic_msg.style.color = "red";
            user_settings_profile_pic_msg.textContent = "Display name cannot be blank!";
            return false;
        }
    }
    else if (update_section == "password")
    {
        let user_settings_password_msg = document.getElementById("user_settings_password_msg");

        dictParams["old_password"] = document.getElementById("old_password").value.trim();
        dictParams["new_password"] = document.getElementById("new_password").value.trim();
        dictParams["confirm_new_password"] = document.getElementById("confirm_new_password").value.trim();

        if (dictParams["old_password"] == "" || dictParams["new_password"] == "" || dictParams["confirm_new_password"] == "") {
            user_settings_password_msg.style.color = "red";
            user_settings_password_msg.textContent = "Please fill all fields in the password section first!";
            return false;
        }
        else if (dictParams["new_password"] != dictParams["confirm_new_password"]) 
        {
            user_settings_password_msg.style.color = "red";
            user_settings_password_msg.textContent = "Please ensure new password and confirm password match!";
            return false;
        }
    }
    
    getUserID(dictParams, update_user_settings_initiate);

    return false;

}


/*
Executes when document is loaded and ready.
*/
$( document ).ready(function() {

    //console.log( "ready!" );
    
    // Get the current page.
    var page_type = document.getElementById("page_type") == null ? '' : document.getElementById("page_type").value;
    
    // show if page type = "search"
    show_search_section(page_type);
    // /show if page type = "search"

    if (page_type == "profile")
    {
        getUserProfileDisplayInfo(page_type);

        getUserProfileStats();

        // get the user's statistics. REPLACES with above function getUserProfileStats().
        /*
        getUserNumOfSubmissions();

        var dictProfileFields = {
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
        
        // I think looping and having so many calls causes this error sometimes:
        // Need to fix > RuntimeError: fewer placeholder () than values (3) for app.py function getUserMostSubmittedX that happens sometimes due to timeout(?)
        // I will perform the loop within the app.py function and see if the timeout does not occur for the above error
        //      app.py: 
        //          ERROR > RuntimeError: fewer placeholder () than values (3)
        //          ERROR LINE > rows = db.execute("SELECT count(iSubmissionID) as 'subCnt' FROM tblSubmissions WHERE iUserID = ?", userID)
        //          WOW SOLUTION > WHERE iUserID = ? AND iUserID = ?", userID, userID) // IF CANT EVEN RECOGNIZE 1 placeholder, FORCE 2
        //      NEVER MIND, IT STILL BREACKS SOMETIMES> I'M GOING CRAZY
        for (const key of Object.keys(dictProfileFields))
        {
            getUserMostSubmittedX(dictProfileFields[key]);            
        }
        */
    }
    else if (page_type == "settings")
    {        
        // Get the user's display information, i.e. profile picture and display name, to display on the page.
        getUserProfileDisplayInfo(page_type);
    }
    else if (page_type == "submit")
    {
        // Event handler for change in the "* Game" input field.
        const txt_submit_game = document.getElementById("txt_submit_game") == null ? null : document.getElementById("txt_submit_game");
        if (txt_submit_game != null) {
            txt_submit_game.addEventListener('change', displayGameImage);   
        }

        // Event handler for change in the "YT URL" input field.
        const txt_YT_URL = document.getElementById("txt_YT_URL") == null ? null : document.getElementById("txt_YT_URL");
        if (txt_YT_URL != null) {
            txt_YT_URL.addEventListener('change', displayYTPrev); //inputHandler);
        }

        // submission time min and max
        max_HH = 8760;

        min_HH_MM_SS_sss = 0;
        max_MM_SS = 59;

        max_sss = 999;

        // Full time hours
        const in_submit_fulltime_HH = document.getElementById("in_submit_fulltime_HH") == null ? null : document.getElementById("in_submit_fulltime_HH");
        if (in_submit_fulltime_HH != null) {
            in_submit_fulltime_HH.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_fulltime_HH.min_limit = min_HH_MM_SS_sss;
            in_submit_fulltime_HH.max_limit = max_HH;
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

        // Full time seconds
        const in_submit_fulltime_SS = document.getElementById("in_submit_fulltime_SS") == null ? null : document.getElementById("in_submit_fulltime_SS");
        if (in_submit_fulltime_SS != null) {
            in_submit_fulltime_SS.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_fulltime_SS.min_limit = min_HH_MM_SS_sss;
            in_submit_fulltime_SS.max_limit = max_MM_SS;
        }

        // Full time milliseconds
        const in_submit_fulltime_sss = document.getElementById("in_submit_fulltime_sss") == null ? null : document.getElementById("in_submit_fulltime_sss");
        if (in_submit_fulltime_sss != null) {
            in_submit_fulltime_sss.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_fulltime_sss.min_limit = min_HH_MM_SS_sss;
            in_submit_fulltime_sss.max_limit = max_sss;
        }

        
        // Best lap time hours
        const in_submit_bestlaptime_HH = document.getElementById("in_submit_bestlaptime_HH") == null ? null : document.getElementById("in_submit_bestlaptime_HH");
        if (in_submit_bestlaptime_HH != null) {
            in_submit_bestlaptime_HH.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_bestlaptime_HH.min_limit = min_HH_MM_SS_sss;
            in_submit_bestlaptime_HH.max_limit = max_HH;
            //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
        }

        // Best lap time minutes
        const in_submit_bestlaptime_MM = document.getElementById("in_submit_bestlaptime_MM") == null ? null : document.getElementById("in_submit_bestlaptime_MM");
        if (in_submit_bestlaptime_MM != null) {
            in_submit_bestlaptime_MM.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_bestlaptime_MM.min_limit = min_HH_MM_SS_sss;
            in_submit_bestlaptime_MM.max_limit = max_MM_SS;
            //document.getElementById("in_submit_fulltime_HH").addEventListener("input", enforce_min_max(in_submit_fulltime_HH, min_HH_MM_SS_sss, -1));
        }

        // Best lap time seconds
        const in_submit_bestlaptime_SS = document.getElementById("in_submit_bestlaptime_SS") == null ? null : document.getElementById("in_submit_bestlaptime_SS");
        if (in_submit_bestlaptime_SS != null) {
            in_submit_bestlaptime_SS.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_bestlaptime_SS.min_limit = min_HH_MM_SS_sss;
            in_submit_bestlaptime_SS.max_limit = max_MM_SS;
        }

        // Best lap time milliseconds
        const in_submit_bestlaptime_sss = document.getElementById("in_submit_bestlaptime_sss") == null ? null : document.getElementById("in_submit_bestlaptime_sss");
        if (in_submit_bestlaptime_sss != null) {
            in_submit_bestlaptime_sss.addEventListener('input', enforce_min_max); //inputHandler);
            in_submit_bestlaptime_sss.min_limit = min_HH_MM_SS_sss;
            in_submit_bestlaptime_sss.max_limit = max_sss;
        }

        // /submissiontime min and max
        
    }

    if (page_type == "home" || page_type == "search" || page_type == "submit") {
        // for search field AND submit field suggestions
        var dictSearchFields = {
            "game":
                {
                    "table":"tblGames",
                    "dbColName":"strGameName",
                    "dbRelCol":"iGameID",
                    "inputId":"search_game",
                    "type":"search"
                },
            "platform":
                {
                    "table":"tblPlatforms",
                    "dbColName":"strPlatformName",
                    "dbRelCol":"iPlatformID",
                    "inputId":"search_platform",
                    "type":"search"
                },
            "display_name":
                {
                    "table":"tblUsers",
                    "dbColName":"strDisplayName",
                    "dbRelCol":"iUserID",
                    "inputId":"search_display_name",
                    "type":"search"
                },
            "vehicle":
                {
                    "table":"tblVehicles",
                    "dbColName":"strVehicleName",
                    "dbRelCol":"iVehicleID",
                    "inputId":"search_vehicle",
                    "type":"search"
                },
            "track":
                {
                    "table":"tblTracks",
                    "dbColName":"strTrackName",
                    "dbRelCol":"iTrackID",
                    "inputId":"search_track",
                    "type":"search"
                },
            "game_mode":
                {
                    "table":"tblGameMode",
                    "dbColName":"strGameModeName",
                    "dbRelCol":"iGameModeID",
                    "inputId":"search_game_mode",
                    "type":"search"
                },
            "submitGame":
                {
                    "table":"tblGames",
                    "dbColName":"strGameName",
                    "dbRelCol":"",
                    "inputId":"txt_submit_game",
                    "type":"submit"
                },
            "submitPlatform":
                {
                    "table":"tblPlatforms",
                    "dbColName":"strPlatformName",
                    "dbRelCol":"",
                    "inputId":"txt_submit_platform",
                    "type":"submit"
                },
            "submitVehicle":
                {
                    "table":"tblVehicles",
                    "dbColName":"strVehicleName",
                    "dbRelCol":"",
                    "inputId":"txt_submit_vehicle",
                    "type":"submit"
                },
            "submitTrack":
                {
                    "table":"tblTracks",
                    "dbColName":"strTrackName",
                    "dbRelCol":"",
                    "inputId":"txt_submit_track",
                    "type":"submit"
                },
            "submitGameMode":
                {
                    "table":"tblGameMode",
                    "dbColName":"strGameModeName",
                    "dbRelCol":"",
                    "inputId":"txt_submit_gamemode",
                    "type":"submit"
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
            inputSearchField.addEventListener('input', inputSuggestionsListener);
            inputSearchField.currSearchField = 'key';
            inputSearchField.currDBColName = dictSearchFields[key]["dbColName"];
            */
            arrSearchVars[i] = (document.getElementById(dictSearchFields[key]["inputId"]) == null) ? '':document.getElementById(dictSearchFields[key]["inputId"]);
            if (arrSearchVars[i] == '')
            {
                continue;
            }
            inputSuggestionsLoad(key, dictSearchFields[key]["table"], dictSearchFields[key]["dbColName"], dictSearchFields[key]["dbRelCol"], dictSearchFields[key]["type"], '');
            /*
            arrSearchVars[i].addEventListener('click', inputSuggestionsListener);
            arrSearchVars[i].addEventListener('input', inputSuggestionsListener);
            arrSearchVars[i].currSearchField = key;
            arrSearchVars[i].currDbTable = dictSearchFields[key]["table"];
            arrSearchVars[i].currDBColName = dictSearchFields[key]["dbColName"];
            arrSearchVars[i].currDbRelCol = dictSearchFields[key]["dbRelCol"];
            arrSearchVars[i].currSuggestionType = dictSearchFields[key]["type"];
            */
            i ++;
        }
    }

    // load submissions
    var submissions_section = document.getElementById("submissions_section");
    
    if(submissions_section) {

        if (page_type == "profile")
        {
            // get submissions by the current user
            search("profile");
        }
        else if (document.getElementById("search_params").value != "")
        {
            // coming from profile
            
            let dictParams = document.getElementById("search_params").value;
            dictParams = dictParams.replace(/'/g, '"');
            
            dictParams = JSON.parse(dictParams);
            dictParams["callbackType"] = "search_from_sub_profile";
            dictParams["mode"] = "search_from_sub_profile";
            
            getUserID(dictParams, searchInitiate);
        }
        else
        {
            search("default");
        }
    }
    document.getElementById("search_params").value = "";
    // /load submissions

    // load comment section
    /*
    var comment_rows = document.getElementById("comment_rows");
    if (comment_rows) {
        build_comments();
    }
    */
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
