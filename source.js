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
        contentMessage: "",
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

        clickHandlerMultipleArticles: function (event) {
            var tmp = this.listToShow;
            console.log(event.target);

            for (index in this.listToShow){
                this.contentMessage += 
                `<div class="col-md-3 mt-5 mr-5">
                    <!-- The a tag and the list-group-item-action make the little arctile clickabel -->
                    <a href="#" class="list-group-item-action" v-on:click="clickHandlerSingleArticle">
                    <div class="card border-primary mb-3 text-black" style="min-width: 10rem; max-width: 18rem;">

                        <!-- Set the id with v-bind="{id: 'some text or' stringVariable}"-->
                        <div class="card-header" v-bind="{ id: '`
                        + this.listToShow[index].id
                        + `'}">`
                        + this.listToShow[index].id
                        + `</div><div class="card-body" v-bind="{ id: text2`
                        //+ this.listToShow[index].id
                        + `}">
                                <div v-if="showType==='locations'">Stadt: {{item.city}}</div>
                                <div v-else>Name: {{item.name}}</div>
                            </div>
                        </div>
                    </a>
                </div>`;
            }
        },

        clickHandlerArticle: function (event) {
            console.log(event.target.id);
        }
    }
})