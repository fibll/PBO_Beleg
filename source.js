
/* to do:
+ Suche
+ Sortierung
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

        // show
        showType: "processes",
        listToShow: [],
        contentList: [],

        // test

    },

    // methods
    methods: {

        fillContent: function () {
            this.contentList = [];
            var newListItem = "";

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

                if(this.showType=='locations'){
                    newListItem += "Stadt: ";
                    newListItem += this.listToShow[i].city;
                }
                else {
                    newListItem += "Name: ";
                    newListItem += this.listToShow[i].name;
                }
                newListItem += `</div><div>`

                // add it to list
                this.contentList.push(newListItem);
            }
        },
        
        // click handler
        clickHandlerArticle: function (event) {
            var tmpList;
            var tmpItem = null;
            // begin of html phrase
            var tmpContent = `<div class="card border-primary mb-3 text-black">`;

            // test
            for(item in this.children[0]){
                console.log(item);                
            }
            console.log(this.children);

            // still in single article view?
            if(event.target.id == "singleArticle"){
                // then do nothing
                return;
            }

            // set the correct source for the search
            // in search case: save search List in a different variable
            if(this.showType == "processes"){
                tmpList = this.children;
            }
            else if(this.showType == "locations") {
                tmpList = this.locations;
            }
            else {
                tmpList = this.stakeholder;
            }

            // search for element in data source
            // necessary cause it could be sorted
            for(var i = 0; i < tmpList.length; i ++){
                if(tmpList[i].id == event.target.id){
                    tmpItem = tmpList[i];
                    break;
                }
            }

            // fill content
            if(tmpItem != null){
                tmpContent += `
                    <div id="singleArticle" class="card-header">`
                    + tmpItem.id
                    + `</div><div id="singleArticle" class="card-body">`;

                for(item in this.children[0]){
                    tmpContent += item + ": <br>";
                }
                tmpContent += `</div>`;
            }
            else{
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

        clickHandlerProcesses: function (event) {
            this.listElement1 = true;
            this.listElement2 = false;
            this.listElement3 = false;

            // show settings
            this.listToShow = this.children;
            this.showType = "processes";

            this.fillContent();

            console.log("clickHandler-Processes");
        },

        clickHandlerLocations: function (event) {
            this.listElement1 = false;
            this.listElement2 = true;
            this.listElement3 = false;

            // show settings
            this.listToShow = this.locations;
            this.showType = "locations";

            this.fillContent();

            console.log("clickHandler-Locations");
        },

        clickHandlerStakeholder: function (event) {
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = true;

            // show settings
            this.listToShow = this.stakeholder;
            this.showType = "stakeholder";

            this.fillContent();

            console.log("clickHandler-Stakeholder");
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