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
        listToShow: [],
        info1: "",
        info2: "",

        // test
        text: "Prozesse",
        text1: "Prozesse",
        text2: "change",
        active: "active",

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

            console.log("reading of json file was successfull");
        });
    },

    // methods
    methods: {

        // click handler
        clickHandlerProcesses: function (event){
            this.listElement1 = true;
            this.listElement2 = false;
            this.listElement3 = false;

            // change list to show
            this.listToShow = this.children;

            console.log("clickHandler-Processes");
        },

        clickHandlerLocations: function (event){
            this.listElement1 = false;
            this.listElement2 = true;
            this.listElement3 = false;

            // change list to show
            this.listToShow = this.locations;

            console.log("clickHandler-Locations");
        },

        clickHandlerStakeholder: function (event){
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = true;

            // change list to show
            this.listToShow = this.stakeholder;

            console.log("clickHandler-Stakeholder");
        }
    }
})