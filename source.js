var vue = new Vue({
    el: "#app",
    data: {
        name: "foo",
        jsonData: {},
        children: [],
        locations: [],
        stakeholder: []
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

            console.log(self.children);

            // test
            self.name = self.jsonData.process.childs[0].name;
            console.log("reading of json file was successfull");
        });
    }
})