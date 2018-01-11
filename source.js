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
        title: "",
        info1: "",
        info2: "",

        // test
        text1: "Information",
        text2: "test"

    },

    // get json stuff
    mounted() {
        var self = this;
        $.getJSON("/src/process.json", function (data) {

            // read in data
            self.jsonData = data;
            self.children = self.jsonData.process.childs;
            self.locations = self.jsonData.process.locations;
            self.stakeholder = self.jsonData.process.stakeholder;

            // set default showed list
            self.listToShow = self.children;
            // self.info1 = self.children.name;
            // self.info2 = self.children.parent;

            console.log("reading of json file was successfull");
        });
    },

    // methods
    methods: {

        // click handler
        clickHandlerProcesses: function (event) {
            this.listElement1 = true;
            this.listElement2 = false;
            this.listElement3 = false;

            // show settings
            this.listToShow = this.children;
            this.showType = "processes";

            console.log("clickHandler-Processes");
        },

        clickHandlerLocations: function (event) {
            this.listElement1 = false;
            this.listElement2 = true;
            this.listElement3 = false;

            // show settings
            this.listToShow = this.locations;
            this.showType = "locations";

            console.log("clickHandler-Locations");
        },

        clickHandlerStakeholder: function (event) {
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = true;

            // show settings
            this.listToShow = this.stakeholder;
            this.showType = "stakeholder";

            console.log("clickHandler-Stakeholder");
        },

        clickHandlerArticle: function (event) {
            console.log(event.target.id);
        }
    }
})