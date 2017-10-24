'use strict';
class HomeController {
  /*@ngInject*/
  constructor(DataService) {
    this.name = 'home';
    this.dataObject = {};

    this.tableIterableobject = [];

      DataService.getData()
        .then(
          (response) => {
              this.dataObject = response.data;
              this.iter( this.dataObject  );
          },

          (data) => {
              console.log('error', data);
          }
      );

  }

    saveCreditRowSpan(index, rowspan){
        this.tableIterableobject[index].rowspan = rowspan;
    }

    iter(inputData) {

        inputData.records.forEach( (clientsIter)=>{
            this.tableIterableobject.push({type:'client', value:clientsIter.clientId, rowspan:false});

            clientsIter.creditCards.forEach( (creditCardIter)=>{
                this.tableIterableobject.push({type:'creditCard', value:creditCardIter.id, rowspan:false});

                    for (var monthIterProp in creditCardIter.monthsData) {
                        this.tableIterableobject.push({type:'month', value:monthIterProp, rowspan:false});


                        creditCardIter.monthsData[monthIterProp].rows.forEach( (rowIter)=>{
                            var rows = [];
                            rows.push({type:'row', value:rowIter.timeStamp, rowspan:1});
                            rows.push({type:'row', value:rowIter.type, rowspan:1});
                            rows.push({type:'row', value:rowIter.amount, rowspan:1});
                            this.tableIterableobject.push({type:'row', value:rows, rowspan:1});
                         });


                    };
            });
        });

        this.setRowspan(this.tableIterableobject);

    }



  setRowspan(inputData){
      var _this = this;

      var mainCounter = 0;
      var indexClient = null;

      var creditCardCounter = 0;
      var indexCreditCard = null;
      var creditCardFlag = true;

      var monthCounter = 0;
      var indexMonth = null;
      var monthFlag = true;


      inputData.forEach(function callback(item, index, array) {
          mainCounter++;
          creditCardCounter++;
          monthCounter++;

          if (item.type === 'month') {
              if (monthFlag) {
                  monthCounter = 1;
                  indexMonth = index;
                  monthFlag = false;
              } else {
                  _this.saveCreditRowSpan(indexMonth, monthCounter-1);
                  monthCounter = 1;
                  indexMonth = index;
              }
          }


          if (item.type === 'creditCard') {
              if ( !monthFlag ){
                  _this.saveCreditRowSpan(indexMonth, monthCounter-1);
                  monthFlag = true;
              }


              if (creditCardFlag) {
                  creditCardCounter = 1;
                  indexCreditCard = index;
                  creditCardFlag = false;
              } else {
                  _this.saveCreditRowSpan(indexCreditCard, creditCardCounter-1);
                  creditCardCounter = 1;
                  indexCreditCard = index;
              }
          }

          if (item.type === 'client'){
              if ( !monthFlag ){
                  _this.saveCreditRowSpan(indexMonth, monthCounter-1);
                  monthFlag = true;
              }

              if ( !creditCardFlag ){
                  _this.saveCreditRowSpan(indexCreditCard, creditCardCounter-1);
                  creditCardFlag = true;
              }

              if ( indexClient === null ) {   //first element
                  indexClient = index;

              } else { //inside elements
                  array[indexClient].rowspan = (indexClient === 0) ? mainCounter - 1 : mainCounter;
                  mainCounter = 1;
                  indexClient = index;
              }
          }


          if ( index+1 === array.length ){ //last element
              inputData[indexClient].rowspan = mainCounter;
              _this.saveCreditRowSpan(indexCreditCard, creditCardCounter);
              _this.saveCreditRowSpan(indexMonth, monthCounter);
          }

      });


      console.log(' this.tableIterableobject', this.tableIterableobject);
  }
}

export default HomeController;
