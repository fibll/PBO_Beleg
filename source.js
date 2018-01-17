
/* to do:
+ Suche
+ Sortierung:
    - Sortiermöglichkeiten ändern
    - "Sortieren nach" ein erklärender Schriftzug)

+ Detailansicht:
    - Zusatzinfos:
        * Prozesse: Wie viele Arbeiten daran + Zeitraum + Kurze Info wann das nächste Projekt ausläuft.
        * Stakeholder: An wie vielen Projekten sind sie beteiligt
    - Unterpunkte in der Detailansicht behandeln, id sollte name oder city anzeigen
    - Punkte mit mehreren Antworten (Hauptprozess-> Children) nicht anzeigen

+ Kontakt Leiste mit Infos aus json file

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

        activeSort1: true,
        activeSort2: false,
        activeSort3: false,
        activeSort4: false,

        noBackButton: true,
        noSortbar: false,

        sortLabel1: "ID",
        sortLabel2: "Name",
        sortLabel3: "Location",
        sortLabel4: "Stakeholder",

        // show
        showType: "processes",
        sortBy: "id",
        listToShow: [],
        contentList: [],

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
            }
            else if (this.showType == "locations") {
                this.listToShow = this.locations;
            }
            else if (this.showType == "system") {
                this.listToShow = [this.jsonData.system];
            }
            else if (this.showType == "entrypoint") {
                this.listToShow = [this.jsonData.entrypoint];
            }
            else if (this.showType == "mainprocess") {
                this.listToShow = [this.jsonData.mainprocess];
            }
            else {
                // processes
                this.listToShow = this.children;
            }
        },

        fillContentProcesses: function (i, newListItem) {
            var tmpLocation;
            var tmpStakeholder;

            var tmpLocation = "";
            var tmpInitiator = "";

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

            var tmpContentList = ["Name", this.listToShow[i].name,
                "Location", tmpLocation,
                "Initiator", tmpInitiator];

            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem;">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].id + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">`;

            // set content in for loop cause it would look to complicated in the code with setting the id all the time
            for (var index = 0; index < tmpContentList.length; index += 2) {
                newListItem += `
                        <tr>
                            <th id="` + this.listToShow[i].id + `">` + tmpContentList[index] + `</th>
                            <td id="`+ this.listToShow[i].id + `">` + tmpContentList[index + 1] + `</td>
                        </tr>`;
            }
            newListItem += `
                    </table>
                </div>
            <div>`;

            return newListItem;
        },

        fillContentLocations: function (i, newListItem) {
            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].id + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">
                        <tr>
                            <th id="` + this.listToShow[i].id + `">Stadt</th>
                            <td id="` + this.listToShow[i].id + `">` + this.listToShow[i].city + `</td>
                        </tr>
                    </table>
                </div>
            <div>`;
            return newListItem;
        },

        fillContentStakeholder: function (i, newListItem) {
            var color = "";
            if (this.listToShow[i].type == "group closed") {
                color = `text-danger">`
            }
            else {
                color = `text-success">`;
            }

            newListItem = `
            <div class="card border-primary mb-3 text-black" style="width: 20rem">
                <div id="` + this.listToShow[i].id + `" class="card-header">` + this.listToShow[i].id + `</div>
                <div id="` + this.listToShow[i].id + `" class="card-body">
                    <table class="table">
                        <tr>
                            <th id="` + this.listToShow[i].id + `">Name</th>
                            <td id="` + this.listToShow[i].id + `">` + this.listToShow[i].name + `</td>
                        </tr>
                        <tr>
                            <th id="` + this.listToShow[i].id + `">Typ</th>
                            <td id="` + this.listToShow[i].id + `" class="` + color + this.listToShow[i].type + `</td>
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
            var newListItem = "";

            // sort listToShow
            this.listToShow = this.sortArray();

            for (var i = 0; i < this.listToShow.length; i++) {

                if(this.showType == "locations") {
                    newListItem = this.fillContentLocations(i, newListItem);
                }
                else if(this.showType == "stakeholder") {
                    newListItem = this.fillContentStakeholder(i, newListItem);
                }
                else {
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
                if (aId >= bId)
                    return 1;
                return 0;
            }

            function compareName(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name >= b.name)
                    return 1;
                return 0;
            }

            function compareCity(a, b) {
                if (a.city < b.city)
                    return -1;
                if (a.city >= b.city)
                    return 1;
                return 0;
            }

            function compareLocation(a, b) {
                if (a.location < b.location)
                    return -1;
                if (a.location >= b.location)
                    return 1;
                return 0;
            }

            function compareStakeholder(a, b) {
                if (a.stakeholder < b.stakeholder)
                    return -1;
                if (a.stakeholder >= b.stakeholder)
                    return 1;
                return 0;
            }

            if (this.sortBy == "name") {
                return this.listToShow.sort(compareName);
            }
            else if (this.sortBy == "location") {
                return this.listToShow.sort(compareLocation);
            }
            else if (this.sortBy == "stakeholder") {
                return this.listToShow.sort(compareStakeholder);
            }
            else if (this.sortBy == "city") {
                return this.listToShow.sort(compareCity);
            }
            else {
                return this.listToShow.sort(compareID);
            }
        },

        // click handler
        clickHandlerArticle: function (event) {

            this.noSortbar = true;
            var tmpList = this.listToShow;
            var tmpItem = null;
            var tmpTypeSingle = false;

            // begin of html phrase
            var tmpContent = `<div class="card border-primary mb-3 text-black">`;

            // if one of the single article sidebar items like 'system'
            if (event == "single") {
                this.noBackButton = true;

                if (this.showType == "system") {
                    tmpItem = this.jsonData.system;
                }
                else if (this.showType == "entrypoint") {
                    tmpItem = this.jsonData.entrypoint;
                }
                else {
                    tmpItem = this.jsonData.process;
                }
            }
            // still in single article view?
            else if (event.target.id == "singleArticle") {
                // then do nothing
                return;
            }
            else {
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
                tmpContent += `
                    <div id="singleArticle" class="card-header">` + tmpItem.id + `</div>
                    <div id="singleArticle" class="card-body">
                        <table class="table">`;

                // fill with all the attributes
                for (item in tmpItem) {

                    // filter the detailes view
                    for(var i = 0; i < blockList.length; i++) {
                        if(blockList[i] == item) {
                            show = false;
                            break;
                        }
                    }
                    if(show){
                        tmpContent += `
                                <tr>
                                    <th id="singleArticle">` + item + `</th>
                                    <td id="singleArticle">` + tmpItem[item] + `</td>
                                </tr>`;
                    }
                    show = true;
                }
                tmpContent += `</div>`;
            }
            else {
                console.log("Nothing was found");

                tmpContent += `
                <div class="card-header">Error</div>
                <div class="card-body">Something did go wrong, please reload the page.</div>`;
            }

            // end of html phrase
            tmpContent += `</div>`;

            // set content as item in the contentList
            this.contentList = [];
            this.contentList.push(tmpContent);
        },

        clickHandlerSidebar: function (event) {
            // do a reset
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = false;
            this.listElement4 = false;
            this.listElement5 = false;
            this.listElement6 = false;

            if (event.target.id == "sidebarLocations") {
                this.listElement2 = true;
                this.showType = "locations";
                this.sortLabel2 = "Stadt";
                // FIX
                if (this.sortBy == "name") {
                    this.sortBy = "city"
                }
            }
            else if (event.target.id == "sidebarStakeholder") {
                this.listElement3 = true;
                this.showType = "stakeholder";
                this.sortLabel2 = "Name";
                // FIX
                if (this.sortBy == "city") {
                    this.sortBy = "name"
                }
            }
            else if (event.target.id == "sidebarSystem") {
                this.listElement4 = true;
                this.showType = "system";
            }
            else if (event.target.id == "sidebarEntrypoint") {
                this.listElement5 = true;
                this.showType = "entrypoint";
            }
            else if (event.target.id == "sidebarMainprocess") {
                this.listElement6 = true;
                this.showType = "mainprocess";
            }
            else {
                this.listElement1 = true;
                this.showType = "processes";
                this.sortLabel2 = "Name";
                // FIX
                if (this.sortBy == "city") {
                    this.sortBy = "name"
                }
            }
            this.setDefaultListToShow();
            if (this.listElement4 | this.listElement5 | this.listElement6) {
                this.clickHandlerArticle("single");
            }
            else {
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
            }
            else if (event.target.id == "sortbarCol3") {
                this.activeSort3 = true;
                this.sortBy = "location";
            }
            else if (event.target.id == "sortbarCol4") {
                this.activeSort4 = true;
                this.sortBy = "stakeholder";
            }
            else {
                this.activeSort1 = true;
                this.sortBy = "id";
            }

            // show new sorted CURRENT content
            // nothing should happen in the single article view
            if (this.showType != "singleArticle") {
                this.fillContent();
            }
        },
    },

    // function called in the beginning
    mounted() {

        // get json stuff
        var self = this;
        $.getJSON("/src/process.json", function (data) {

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