require.config({
    baseUrl: '../dist',
    paths: {
        'malicacid': ['malicacid.bundle'],
        'malicacidcss': ['malicacidcss.bundle'],
        'jquery': ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min'],
    }
});

require(["jquery", "malicacid", "malicacidcss"], function($, malicAcid){
    class BaseFormOverride extends malicAcid.BasicForm{
        constructor(options){
            super(options);
        }

        formInteractivityInit(oprions){
            console.log("BaiscForm Overridden form interactivity init");
        }

    }


    class DeviceStatusForm extends malicAcid.BasicFormWithGenerators{
        constructor(options){
            super(options);
        }

        formInteractivityInit(oprions){
            console.log("Overridden form interactivity init");
        }

        dataIn(data){
            let transpose = data;
            let metaDataGenerator = this.generators[0];

            this.populateGenerator(metaDataGenerator, transpose && transpose.metadata ? transpose.metadata : []);
            this.booleanToYesOrNo(data, transpose, "device_lock_state");

            return transpose;
        }

        dataOut(rawData){
            let transpose = rawData;

            this.yesOrNoToBoolean(rawData, transpose, "device_lock_state");
            let metaDataGenerator = this.generators[0];
            transpose.metadata = this.collateGenerator(metaDataGenerator);

            return transpose;
        }
    }

    const basicForm = new BaseFormOverride({form: $("#basic-form")});

    const form = new DeviceStatusForm({form: $("#form_device")});
    const submitFunc =  function(e){
        alert("Submitted form JSON will be written to the console.");
        console.log(this.getFormData());
        //Allow resubmissions by unlocking the forms
        this.unlock();
    }.bind(form);

    const populateForm = function(e){
        let content = $("#load-entry").text();
        let data = JSON.parse(content);
        this.reset();
        this.setFormData(data);
    }.bind(form);

    const loadConfirm = new malicAcid.ConfirmationModal({
            title: "Are you sure?",
            content: "Are you sure you want to populate this form with the data in the green text area?"
        },
        {
            yes: populateForm
        }
    );

    $("#submit-this").on("click", submitFunc);
    $("#populate-form").on("click", function(){
        loadConfirm.open();
    });
    form.on("form:submitted", function(e){
        alert("Form submission captured");
        submitFunc();
    });
});



