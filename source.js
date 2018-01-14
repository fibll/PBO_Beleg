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
        // grid of little articles as default contentMessage
        listToShow: [1],
        title: "",
        info1: "",
        info2: "",

        // test
        text1: "Information",
        text2: "test",
        contentMessage: "bla",
        contentList: []

    },

    // methods
    methods: {

        fillContent: function () {
            this.contentList = [];

            console.log(this.listToShow);
            //this.listToShow = this.children;
            var newListItem = "";

            for (var i = 0; i < this.listToShow.length; i++) {
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
                this.contentList.push(newListItem);
            }
        },
        
        // click handler
        clickHandlerArticle: function (event) {
            console.log(event.target.id);
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