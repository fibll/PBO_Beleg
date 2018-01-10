var vue = new Vue({
    el: "#tmp",
    data: {
        name: "bla",
        jsonData: {system:[] , process:[]},
    },

    // get json stuff
    mounted(){
        var itself = this;
        $.getJSON("../src/process.json", function(data) {
            itself.jsonData = data;
            itself.json_tmp  = self.json_data.process.childs;
            itself.child_num = JsonCount(self.json_data.process.childs);
            //alert(JsonCount(self.json_data.process.childs));
        });
    }
})