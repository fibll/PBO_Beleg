/* to do:

+ Contentansicht:
    - Locations sollten einen oder zwei weitere Unterpunkte haben
    - Stakeholder eventuell auch einen mehr

+ Detailansicht:
    - Zusatzinfos:
        * Prozesse: Zeitraum + Kurze Info wann das nächste Projekt ausläuft.

    - Klickbar:
        * Prozesse: Initiator?
        * Message an den Nutzer das er nun in einer speziellen Kontent Auswahl ist

+ Stats:
    * Prozesse: Zeitleiste in Jahren, wann starteten Projekte (andere Farbe wann endeten sie)
    * Stakeholder: Wie viele Mitarbeiter haben wie viele Projekte (Säulen Diagramm)

+ Bilder hinzufügen

+ Alles auf Deutsch umstellen

+ Vergleich: locale compare, to_lower (für Umlaute, Groß-/Kleinschreibung)

+ class="col-md-auto" problem behandeln

questions:
*/

var vue = new Vue({
    el: "#app",
    data: {
        // data
        jsonData: {},
        children: [],
        locations: [],
        stakeholder: [],

        // active
        listElement1: true,
        listElement2: false,
        listElement3: false,
        listElement4: false,
        listElement5: false,
        listElement6: false,

        // sort active
        activeSort1: true,
        activeSort2: false,
        activeSort3: false,
        activeSort4: false,

        noBackButton: true,
        noSortbar: false,

        // labels
        sortLabel1: "ID",
        sortLabel2: "Name",
        sortLabel3: "Enddate",
        sortLabel4: "Initiator",

        // hiding
        noSortItem3: false,
        noSortItem4: true,

        // filter
        filterLabel1: "Open for stakeholder",
        filterLabel2: "Active",
        activeFilter1: false,
        activeFilter2: false,
        noFilter1: false,
        noFilter2: false,
        outtakenFilter1: [],
        outtakenFilter2: [],

        // info message if special content is selected
        selectedContentView: false,
        selectedContentViewMessage: "",

        // show
        showType: "processes",
        sortBy: "id",
        listToShow: [],
        contentList: [],
        participantsData: [],
        activeProjectsData: [],
        contentView: true,

        // detail view
        detailHeader: "Error",

        // test
        sortbarListProcesses: ["ID", "Name"],
        sortbarListLocations: ["ID", "Stadt"],
        sortbarListStakeholder: ["ID", "Name"],
        name: "foo",
    },

    // stuff that takes more logic power
    /*
    computed: {
        sortArray: function () {
            function compare(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            }

            return this.listToShow.sort(compare);
        },
    },
    */

    // methods
    methods: {

        setDefaultListToShow: function () {
            if (this.showType == "stakeholder") {
                this.listToShow = this.stakeholder;
            } else if (this.showType == "locations") {
                this.listToShow = this.locations;
            } else if (this.showType == "system") {
                this.listToShow = [this.jsonData.system];
            } else if (this.showType == "entrypoint") {
                this.listToShow = [this.jsonData.entrypoint];
            } else if (this.showType == "mainprocess") {
                this.listToShow = [this.jsonData.mainprocess];
            } else {
                // processes
                this.listToShow = this.children;
            }
        },

        setStakeholderSettings: function () {
            this.resetBars();

            this.listElement3 = true;
            this.showType = "stakeholder";
            this.sortLabel2 = "Name";
            this.sortLabel3 = "Type";
            this.noSortItem3 = false;
            this.noFilter1 = false;
            this.activeFilter1 = false;
            this.filterLabel1 = "Open groups";
            this.contentView = true;
        },

        setProcessSettings: function () {
            this.resetBars();

            this.listElement1 = true;
            this.showType = "processes";
            this.sortLabel2 = "Name";
            this.sortLabel3 = "Enddate";
            this.noSortItem3 = false;
            this.noFilter1 = false;
            this.noFilter2 = false;
            this.activeFilter1 = false;
            this.activeFilter2 = false;
            this.filterLabel1 = "Open for stakeholder";
        },

        fillContentProcesses: function (i, newListItem) {
            var tmpLocation;
            var tmpStakeholder;

            var tmpLocation = "";
            var tmpInitiator = "";

            // convert id to readableId
            var tmpList = this.listToShow[i].id.split("/");
            var readableID = this.capitalFirstLetter(tmpList[tmpList.length - 2]) + "/" + Number(tmpList[tmpList.length - 1]);

            // get city out of location object
            for (var k = 0; k < this.locations.length; k++) {
                if (this.locations[k].id == this.listToShow[i].location) {
                    tmpLocation = this.locations[k].city;
                    break;
                }
            }

            // get city out of location object
            for (var k = 0; k < this.stakeholder.length; k++) {
                if (this.stakeholder[k].id == this.listToShow[i].initiator) {
                    tmpInitiator = this.stakeholder[k].name;
                    break;
                }
            }

            var tmpContentList = ["ID", readableID,
                "Location", tmpLocation,
                "Initiator", tmpInitiator
            ];

            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem;">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].name + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">`;

            // set content in for loop cause it would look to complicated in the code with setting the id all the time
            for (var index = 0; index < tmpContentList.length; index += 2) {
                newListItem += `
                        <tr>
                            <th id="` + this.listToShow[i].id + `">` + tmpContentList[index] + `</th>
                            <td id="` + this.listToShow[i].id + `">` + tmpContentList[index + 1] + `</td>
                        </tr>`;
            }
            newListItem += `
                    </table>
                </div>
            <div>`;

            return newListItem;
        },

        fillContentLocations: function (i, newListItem) {
            // convert id to readableId
            var tmpList = this.listToShow[i].id.split("/");
            var readableID = this.capitalFirstLetter(tmpList[tmpList.length - 2]) + "/" + Number(tmpList[tmpList.length - 1]);

            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].city + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">
                        <tr>
                            <th id="` + this.listToShow[i].id + `">ID</th>
                            <td id="` + this.listToShow[i].id + `">` + readableID + `</td>
                        </tr>
                    </table>
                </div>
            <div>`;
            return newListItem;
        },

        fillContentStakeholder: function (i, newListItem) {
            var color = "";

            // convert id to readableId
            var tmpList = this.listToShow[i].id.split("/");
            var readableID = this.capitalFirstLetter(tmpList[tmpList.length - 2]) + "/" + Number(tmpList[tmpList.length - 1]);

            if (this.listToShow[i].type == "group closed")
                color = `text-danger`
            else
                color = `text-success`;

            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].name + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">
                        <tr>
                            <th id="` + this.listToShow[i].id + `">ID</th>
                            <td id="` + this.listToShow[i].id + `">` + readableID + `</td>
                        </tr>
                        <tr>
                            <th id="` + this.listToShow[i].id + `">Type</th>
                            <td id="` + this.listToShow[i].id + `" class="` + color + `">` + this.listToShow[i].type + `</td>
                        </tr>
                    </table>
                </div>
            <div>`;
            return newListItem;
        },

        fillContent: function () {

            this.noBackButton = true;
            this.noSortbar = false;
            this.contentList = [];
            this.contentView = true;
            var newListItem = "";

            // sort listToShow
            this.listToShow = this.sortArray();

            for (var i = 0; i < this.listToShow.length; i++) {

                if (this.showType == "locations") {
                    newListItem = this.fillContentLocations(i, newListItem);
                } else if (this.showType == "stakeholder") {
                    newListItem = this.fillContentStakeholder(i, newListItem);
                } else {
                    newListItem = this.fillContentProcesses(i, newListItem);
                }

                // add it to list
                this.contentList.push(newListItem);
            }
        },

        sortArray: function () {
            function compareID(a, b) {
                // get id number from id string
                var tmpListA = a.id.split("/");
                var aId = Number(tmpListA[tmpListA.length - 1]);
                var tmpListB = b.id.split("/");
                var bId = Number(tmpListB[tmpListB.length - 1]);

                if (aId < bId)
                    return -1;
                if (aId > bId)
                    return 1;
                return 0;
            }

            function compareName(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            }

            function compareCity(a, b) {
                if (a.city < b.city)
                    return -1;
                if (a.city > b.city)
                    return 1;
                return 0;
            }

            function compareLocation(a, b) {
                if (a.location < b.location)
                    return -1;
                if (a.location > b.location)
                    return 1;
                return 0;
            }

            function compareStakeholder(a, b) {
                if (a.stakeholder < b.stakeholder)
                    return -1;
                if (a.stakeholder > b.stakeholder)
                    return 1;
                return 0;
            }

            function compareType(a, b) {
                if (a.type != "group closed" && b.type == "group closed")
                    return -1;
                if (a.type == "group closed" && b.type != "group closed")
                    return 1;
                return 0;
            }

            function compareEndDate(a, b) {
                // convert do date
                var dateA = new Date(a["end (optional)"]);
                var dateB = new Date(b["end (optional)"]);

                // compare dates
                if (isNaN(dateA.getTime()))
                    return 1;
                if (dateA.getTime() < dateB.getTime())
                    return -1;
                if (dateA.getTime() > dateB.getTime())
                    return 1;
                else
                    return 0;
            }


            function compareInitiator(a, b) {
                if (a.initiator < b.initiator)
                    return -1;
                if (a.initiator > b.initiator)
                    return 1;
                return 0;
            }


            if (this.sortBy == "name") {
                return this.listToShow.sort(compareName);
            } else if (this.sortBy == "location") {
                return this.listToShow.sort(compareLocation);
            } else if (this.sortBy == "stakeholder") {
                return this.listToShow.sort(compareStakeholder);
            } else if (this.sortBy == "city") {
                return this.listToShow.sort(compareCity);
            } else if (this.sortBy == "sortbarCol3") {
                if (this.showType == "stakeholder") {
                    return this.listToShow.sort(compareType);
                } else {
                    return this.listToShow.sort(compareEndDate)
                }
            }
            /*
            else if (this.sortBy == "sortbarCol4") {
                return this.listToShow.sort(compareCity);
            }
            */
            else {
                return this.listToShow.sort(compareID);
            }
        },

        resetBars: function () {
            // do a reset
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = false;
            this.listElement4 = false;
            this.listElement5 = false;
            this.listElement6 = false;

            this.activeSort1 = true,
                this.activeSort2 = false,
                this.activeSort3 = false,
                this.activeSort4 = false,

                this.noSortItem3 = true;
            this.noSortItem4 = true;

            this.activeFilter1 = false;
            this.activeFilter2 = false;
            this.noFilter1 = true;
            this.noFilter2 = true;
            this.selectedContentView = false;

            this.sortBy = "id";
        },

        // click handler
        clickHandlerArticle: function (event) {

            this.noSortbar = true;
            this.contentView = false;
            var tmpList = this.listToShow;
            var tmpItem = null;
            var tmpTypeSingle = false;

            // begin of html phrase
            var tmpContent;// = `<div class="card border-primary mb-3 text-black" style="max-width: 45rem">`;

            // if one of the single article sidebar items like 'system'
            if (event == "single") {
                this.noBackButton = true;

                if (this.showType == "system") {
                    tmpItem = this.jsonData.system;
                } else if (this.showType == "entrypoint") {
                    tmpItem = this.jsonData.entrypoint;
                } else {
                    tmpItem = this.jsonData.process;
                }
            }
            // still in single article view?
            else if (event.target.id == "singleArticle") {
                // then do nothing
                return;
            }
            // change to content view with the projects of the stakeholder
            else if (event.target.id == "showProjects") {
                // reset this.listToShow
                this.listToShow = this.activeProjectsData;

                // set this.showType to process
                this.showType = "processes";
                
                // set the sorrounding to process as well
                this.setProcessSettings();

                // call fillContent()
                this.fillContent();

                // set content view select message
                this.selectedContentView = true;

                // clear activeProjectsData
                this.activeProjectsData = [];

                return;
            }
            // change to content view with the participants of the project
            else if (event.target.id == "showParticipants") {
                // reset this.listToShow
                this.listToShow = this.participantsData;

                // set this.showType to stakeholder
                this.showType = "stakeholder";
                
                // set the sorrounding to stakeholder as well
                // - Sidebar to stakeholder
                // - sort/filter bar to stakeholder
                this.setStakeholderSettings();

                // call fillContent()
                this.fillContent();
                            
                // set content view select message
                this.selectedContentView = true;

                // clear participantsData
                this.participantsData = [];

                return;
            } else {
                this.noBackButton = false;

                // search for element in data source
                // necessary cause it could be differently sorted
                for (var i = 0; i < tmpList.length; i++) {
                    if (tmpList[i].id == event.target.id) {
                        tmpItem = tmpList[i];
                        break;
                    }
                }
            }

            // fill content
            if (tmpItem != null) {
                var blockList = ["childs", "reference (optional)", "transformation", "connection", "contact (optional)", "geoCoords (optional)", "parent", "stakeholder", "locations"];
                var show = true;

                // name or city
                if (this.showType == "locations")
                    this.detailHeader = tmpItem.city;
                else
                    this.detailHeader = tmpItem.name

                //tmpContent += `
                //<div id="singleArticle" class="card-header">` + header + `</div>
                //<div id="singleArticle" class="card-body">
                //    <table class="table">`;

                tmpContent += `
                        <table class="table">`;

                // fill with all the attributes
                for (item in tmpItem) {

                    // filter the detailes view
                    for (var i = 0; i < blockList.length; i++) {
                        if (blockList[i] == item) {
                            show = false;
                            break;
                        }
                    }

                    // handle special properties ---
                    // don't show if it got array structure
                    // exception for participants
                    if (Array.isArray(tmpItem[item]) & item != "participants") {;
                    }
                    // get readable ids (all)
                    else if (item == "id") {
                        var tmpList = tmpItem.id.split("/");
                        var readableID = this.capitalFirstLetter(tmpList[tmpList.length - 2]) + "/" + Number(tmpList[tmpList.length - 1]);

                        // fill
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">ID</th>
                                    <td id="singleArticle">` + readableID + `</td>
                                </tr>`;
                    }
                    // replace initiator id with name (process)
                    else if (item == "initiator") {
                        var initiatorName;

                        // search in stakeholder for id
                        for (i in this.stakeholder) {
                            if (tmpItem.initiator == this.stakeholder[i].id) {
                                // save name
                                initiatorName = this.stakeholder[i].name;
                                break;
                            }
                        }

                        // fill
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">` + this.capitalFirstLetter(item) + `</th>
                                    <td id="singleArticle">` + initiatorName + `</td>
                                </tr>`;
                    }
                    // replace location id with city (process)
                    else if (item == "location") {
                        var locationCity;

                        // search in locations for id
                        for (i in this.locations) {
                            if (tmpItem.location == this.locations[i].id) {
                                // save city name
                                locationCity = this.locations[i].city;
                                break;
                            }
                        }

                        // fill
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">` + this.capitalFirstLetter(item) + `</th>
                                    <td id="singleArticle">` + locationCity + `</td>
                                </tr>`;
                    }
                    // change color of type (stakeholder) not in the case of the three single options
                    else if (item == "type" & event != "single") {
                        var color;
                        if (tmpItem.type == "group closed")
                            color = `text-danger`
                        else
                            color = `text-success`;

                        // fill
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">Type</th>
                                    <td id="singleArticle" class="` + color + `">` + tmpItem.type + `</td>
                                </tr>`;
                    }
                    // change color of participation (process)
                    else if (item == "participation") {
                        var color;
                        if (tmpItem.participation == "closed")
                            color = `text-danger`
                        else
                            color = `text-success`;

                        // fill
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">Participation</th>
                                    <td id="singleArticle" class="` + color + `">` + tmpItem.participation + `</td>
                                </tr>`;
                    }
                    // make participants clickable, to show later the participants in a content view
                    else if (item == "participants") {
                        // save data for possible click action
                        this.participantsData = [];

                        // save name of project for selected content message
                        this.selectedContentViewMessage = "Auswahl der Stakeholder des Projektes: " + tmpItem.name;

                        tmpContent += `
                                <tr>
                                    <th id="showParticipants">` + this.capitalFirstLetter(item) + `</th>
                                    <td id="showParticipants">`;

                        // go through stakeholder and compare
                        for (stakeItem in this.stakeholder) {
                            for (participantsItem in tmpItem[item]) {
                                if (this.stakeholder[stakeItem].id == tmpItem[item][participantsItem]) {
                                    tmpContent += `<li id="showParticipants">` + this.stakeholder[stakeItem].name + "</li>";

                                    // save to this.participantsData to later show a content view (with a click)
                                    this.participantsData.push(this.stakeholder[stakeItem]);
                                }
                            }
                        }

                        tmpContent += `
                                    </td>
                                </tr>`;
                    }
                    // show the rest normaly
                    else if (show) {

                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">` + this.capitalFirstLetter(item) + `</th>
                                    <td id="singleArticle">` + tmpItem[item] + `</td>
                                </tr>`;
                    }

                    show = true;
                }

                // check for stakeholder detail view
                // Add Amount of Projects that he is included in
                if (this.showType == "stakeholder") {
                    var projectCounter = 0;
                    var activeProjectCounter = 0;
                    var workingProjects = [];

                    // save name of project for selected content message
                    this.selectedContentViewMessage = "Auswahl der Projekte des Stakeholder: " + tmpItem.name;

                    // get current date
                    var currentDate = new Date();
                    var itemDate;

                    for (item in this.children) {
                        for (subitem in this.children[item].participants) {
                            // is the stakeholder included ?
                            if (this.children[item].participants[subitem] == tmpItem.id) {
                                projectCounter++;

                                // check if project is still running
                                itemDate = new Date(this.children[item]["end (optional)"]);

                                if (isNaN(itemDate.getTime()) | itemDate.getTime() > currentDate.getTime()) {
                                    activeProjectCounter++;
                                    // save name of project in list
                                    workingProjects.push(this.children[item].name);

                                    // save whole project information for the possibility of clicking on the list and get to the content view
                                    this.activeProjectsData.push(this.children[item]);
                                }
                                break;
                            }
                        }
                    }

                    // fill content
                    tmpContent += `
                    <tr>
                        <th id="singleArticle">Amount of projects</th>
                        <td id="singleArticle">` + projectCounter;

                    // fill project-list with working projects if they got one, otherwise don't show that line
                    if (projectCounter > 0) {
                        tmpContent += `
                        </td>
                    </tr>
                    <tr>
                        <th id="showProjects">Active projects</th>
                        <td id="showProjects">`;
                        // <th id="showProjects">Active projects<br><br><button id="showProjects" class="btn">Details</button></th>
                    

                        for (item in workingProjects) {
                            tmpContent += `<li id="showProjects">` + workingProjects[item] + "</li>";
                        }
                    }

                    tmpContent += `
                        </td>
                    </tr>`;
                }


                // close table div
                //tmpContent += `</div>`;

            } else {
                console.log("Nothing was found");

                this.detailHeader = "Error";

                //tmpContent += `
                //<div class="card-header">Error</div>
                //<div class="card-body">Something did go wrong, please reload the page.</div>`;
            }

            // end of html phrase
            //tmpContent += `</div>`;

            // set content as item in the contentList
            this.contentList = [];
            this.contentList.push(tmpContent);
        },

        clickHandlerSidebar: function (event) {
            this.resetBars();

            // set showType and sidebar item active
            if (event.target.id == "sidebarLocations") {
                this.listElement2 = true;
                this.showType = "locations";
                this.sortLabel2 = "City";
            } else if (event.target.id == "sidebarStakeholder") {
                this.setStakeholderSettings();
            } else if (event.target.id == "sidebarSystem") {
                this.listElement4 = true;
                this.showType = "system";
            } else if (event.target.id == "sidebarEntrypoint") {
                this.listElement5 = true;
                this.showType = "entrypoint";
            } else if (event.target.id == "sidebarMainprocess") {
                this.listElement6 = true;
                this.showType = "mainprocess";
            } else {
                this.setProcessSettings();
            }
            // set the data source for the content
            this.setDefaultListToShow();
            if (this.listElement4 | this.listElement5 | this.listElement6) {
                this.clickHandlerArticle("single");
            } else {
                // fill the content space
                this.fillContent();
            }
        },

        clickHandlerSortbar: function (event) {
            // do a reset
            this.activeSort1 = false;
            this.activeSort2 = false;
            this.activeSort3 = false;
            this.activeSort4 = false;

            if (event.target.id == "sortbarCol2") {
                this.activeSort2 = true;
                this.sortBy = "name";

                // special case - shouldn't be so
                if (this.showType == "locations") {
                    this.sortBy = "city";
                }
            } else if (event.target.id == "sortbarCol3") {
                this.activeSort3 = true;
                this.sortBy = "sortbarCol3";
            } else if (event.target.id == "sortbarCol4") {
                this.activeSort4 = true;
                this.sortBy = "sortbarCol4";
            } else {
                this.activeSort1 = true;
                this.sortBy = "id";
            }

            // show new sorted CURRENT content
            // nothing should happen in the single article view
            if (this.showType != "singleArticle") {
                this.fillContent();
            }
        },

        clickHandlerFilter: function (event) {
            if (event.target.id == "filter1") {
                if (this.activeFilter1) {
                    this.activeFilter1 = false;

                    // get old item back into list
                    for (item in this.outtakenFilter1) {
                        this.listToShow.push(this.outtakenFilter1[item]);
                    }
                    // reset list
                    this.outtakenFilter1 = [];
                } else {
                    this.activeFilter1 = true;

                    // build new listToShow
                    if (this.showType == "processes") {
                        var tmpList = [];
                        for (item in this.listToShow) {
                            if (this.listToShow[item].participation != "closed")
                                tmpList.push(this.listToShow[item]);
                            else {
                                this.outtakenFilter1.push(this.listToShow[item]);
                            }
                        }
                    }

                    // build new listToShow
                    if (this.showType == "stakeholder") {
                        var tmpList = [];
                        for (item in this.listToShow) {
                            if (this.listToShow[item].type != "group closed")
                                tmpList.push(this.listToShow[item]);
                            else {
                                this.outtakenFilter1.push(this.listToShow[item]);
                            }
                        }
                    }
                    this.listToShow = tmpList;
                }

            }

            if (event.target.id == "filter2") {
                if (this.activeFilter2) {
                    this.activeFilter2 = false;

                    // get old item back into list
                    //this.listToShow.concat(this.outtakenFilter2);
                    for (item in this.outtakenFilter2) {
                        this.listToShow.push(this.outtakenFilter2[item]);
                    }
                    // reset list
                    this.outtakenFilter2 = [];
                } else {
                    this.activeFilter2 = true;

                    // build new listToShow
                    if (this.showType == "processes") {
                        var tmpList = [];

                        // get current date
                        var currentDate = new Date();
                        var itemDate;

                        for (item in this.listToShow) {
                            itemDate = new Date(this.listToShow[item]["end (optional)"]);

                            if (isNaN(itemDate.getTime()) | itemDate.getTime() > currentDate.getTime()) {
                                tmpList.push(this.listToShow[item]);
                            } else {
                                this.outtakenFilter2.push(this.listToShow[item]);
                            }

                        }
                    }
                    this.listToShow = tmpList;
                }
            }
            // show new content
            this.fillContent();
        },

        capitalFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
    },

    // function called in the beginning
    mounted() {

        // get json stuff
        var self = this;
        $.getJSON("data/process.json", function (data) {

            // read in data
            self.jsonData = data;
            self.children = self.jsonData.process.childs;
            self.locations = self.jsonData.process.locations;
            self.stakeholder = self.jsonData.process.stakeholder;

            console.log("reading of json file was successfull");

            // init
            self.listToShow = self.children;

            // fill with content
            self.fillContent();
        });
    },

})