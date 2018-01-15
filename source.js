
/* to do:
+ Suche
+ Sortierung
+ Sortiermöglichkeiten ändern!

questions:
+ Wie iteriert man durch ein Objekt?
+ Aufruf einer Computed Funktion?
*/

var vue = new Vue({
    el: "#app",
    data: {
        name: "foo",

        // data
        jsonData: {},
        children: [],
        locations: [],
        stakeholder: [],

        // active
        listElement1: true,
        listElement2: false,
        listElement3: false,

        activeSort1: true,
        activeSort2: false,
        activeSort3: false,
        activeSort4: false,

        // show
        showType: "processes",
        sortAfter: "id",
        listToShow: [],
        contentList: [],

        // test

    },

    // stuff that takes more logic power
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

    // methods
    methods: {

        setDefaultListToShow: function (){
            if(this.showType == "processes") {
                this.listToShow = this.children;
            }
            else if(this.showType == "locations") {
                this.listToShow = this.locations;
            }
            else {
                this.listToShow = this.stakeholder;
            }
        
        },

        fillContent: function () {
            this.contentList = [];
            var newListItem = "";

            // sort listToShow
            this.listToShow = this.sortArray();

            for (var i = 0; i < this.listToShow.length; i++) {
                // get the html code together
                newListItem = `
                <div class="card border-primary mb-3 text-black" style="width: 20rem">
                    <div id="`
                    + this.listToShow[i].id
                    + `" class="card-header">`
                    + this.listToShow[i].id
                    + `</div><div id="`
                    + this.listToShow[i].id
                    + `" class="card-body">`;

                if (this.showType == 'locations') {
                    newListItem += "Stadt: ";
                    newListItem += this.listToShow[i].city;
                }
                else {
                    newListItem += "Name: ";
                    newListItem += this.listToShow[i].name;
                }
                newListItem += `</div><div>`;

                // add it to list
                this.contentList.push(newListItem);
            }
        },

        sortArray: function () {
            function compareID(a, b) {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
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

            if(this.sortAfter == "name"){

                console.log("sort name");
                return this.listToShow.sort(compareName);
            }
            else if(this.sortAfter == "location"){

                console.log("sort loc");
                return this.listToShow.sort(compareLocation);
            }

            else if(this.sortAfter == "stakeholder"){

                console.log("sort stake");
                return this.listToShow.sort(compareStakeholder);
            }

            console.log("sort id");
            return this.listToShow.sort(compareID);
        },

        // click handler
        clickHandlerArticle: function (event) {
            var tmpList = this.listToShow;
            var tmpItem = null;
            // begin of html phrase
            var tmpContent = `<div class="card border-primary mb-3 text-black">`;

            // still in single article view?
            if (event.target.id == "singleArticle") {
                // then do nothing
                return;
            }

            // search for element in data source
            // necessary cause it could be sorted
            for (var i = 0; i < tmpList.length; i++) {
                if (tmpList[i].id == event.target.id) {
                    tmpItem = tmpList[i];
                    break;
                }
            }

            // fill content
            if (tmpItem != null) {
                tmpContent += `
                    <div id="singleArticle" class="card-header">`
                    + tmpItem.id
                    + `</div><div id="singleArticle" class="card-body">`;

                // fill with all the attributes
                for (item in this.listToShow[0]) {
                    tmpContent += item + ": <br>";
                }
                tmpContent += `</div>`;
            }
            else {
                console.log("Nothing was found");

                tmpContent += `
                <div class="card-header">`
                    + "Error"
                    + `</div>
                    <div class="card-body">`
                    + "Something did go wrong, please reload the page."
                    + `</div>`;
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

            if (event.target.id == "sidebarProcesses") {
                this.listElement1 = true;
                this.showType = "processes";
            }
            else if (event.target.id == "sidebarLocations") {
                this.listElement2 = true;
                this.showType = "locations";
            }
            else {
                this.listElement3 = true;
                this.showType = "stakeholder";
            }

            this.setDefaultListToShow();            
            this.fillContent();
        },

        clickHandlerSortbar: function (event) {
            // do a reset
            this.activeSort1 = false;
            this.activeSort2 = false;
            this.activeSort3 = false;
            this.activeSort4 = false;

            if (event.target.id == "sortbarId1") {
                this.activeSort1 = true;
                this.sortAfter =  "id";

            }
            else if (event.target.id == "sortbarId2") {
                this.activeSort2 = true;
                this.sortAfter =  "name";
            }
            else if (event.target.id == "sortbarId3") {
                this.activeSort3 = true;
                this.sortAfter =  "location";
            }
            else {
                this.activeSort4 = true;
                this.sortAfter =  "stakeholder";
            }

            // show new sorted CURRENT content
            // nothing should happen in the single article view
            if(this.showType != "singleArticle"){
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