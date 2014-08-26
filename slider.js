var Event	=	(function(){

	//just makin slice to another variable
	var slice =	Array.prototype.slice;

	//Event
	var Event 	=	function(){
		this.jQwrapper	=	$({});
		//attaching our custom on 
		this.on			=	function(name,func,context){
			//.on( eventstype,function_to_execute, )
			//name  =	name of the event handler,in this case this is a custom event handler
			//funct =   some function that has to excuted when the event hadler comes
			//context	== used in apply to call that function 

			this.jQwrapper.on(name,function(){


			},)


		};
		//ataching out custom trigger
		this.trigger	=	function(){

		};

	};
	return Event;
})();


//wrapping the function
(function(global){

						
	//all these are settings that a slide can have
	var sliderObj		={	
        data : [],
        activeSlide : null,
        setActive : function ( slidedm ){
            this.activeSlide = slidedm;
            this.trigger('slide_active_changed');
        },
        addSlide : function (){
            var slidedm  = Slide({
                name :'slide '+ +(new Date()),
                layers : [],
                parent : this,
            });

            this.data.push( slidedm );
            this.activeSlide = slidedm;
            this.trigger('slide_added');
            return slidedm;
        },
        getData : function (){
            return this.data;
        }
    }

    //merges the first array with the second
	var datamanager	=	{};
	global.datamanager = sliderObj;

})(this);



var main = {

	dm:function(){
		

	},

	init:function($main){
		 this.$main = $main ;
		 
	}
};