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
            console.log("clickHandler-Processes");
        },

        clickHandlerLocations: function (event){
            this.listElement1 = false;
            this.listElement2 = true;
            this.listElement3 = false;
            console.log("clickHandler-Locations");
        },

        clickHandlerStakeholder: function (event){
            this.listElement1 = false;
            this.listElement2 = false;
            this.listElement3 = true;
            console.log("clickHandler-Stakeholder");
        }
    }
})