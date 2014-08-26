var Event = ( function(){
    var slice = Array.prototype.slice;
    var Event = function()
    {
        this.ev = $({}),
        this.on = function ( name , func , context ){
            this.ev.on( name, function () {
                func.apply( context, slice.call( arguments, 1 ) );
            });
        };
        this.trigger = function ( name ){
            this.ev.trigger( name , slice.call( arguments, 1 ) );
        };
    };
    return Event;
})();


// data management
( function ( global ) {

    var Slide = function( options ){
        var slide = {};
        $.extend( slide , new Event(), options  );
        slide.addLayer = function (){
            var layerdm  = Layer({
                name :'layer '+ +(new Date()),
                parent : this,
            });
            slide.layers.push( layerdm );
            slide.trigger('layer_added', layerdm );
            slide.parent.trigger('layer_added', slide );
        };
        return slide;
    };

    var Layer = function( options ){
        var layer = $.extend( {}, new Event(), options );
        return layer;
    };

    // data manager
    var dataManager = $.extend( new Event(), {
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
    });

    global .dataManager = dataManager ;
})( this );

// master
var mainView  = {
    slides : [],
    dm : dataManager,
    $el : null,
    slideView : null,
    init : function ( $el ){
        this.$el = $el ;
        this.dm.on('slide_added', this.appendSlide , this );
        this.dm.on('slide_active_changed', this.renderSlideView , this );
    },
    addSlide : function( ){
        this.dm.addSlide();
    },
    getSlide : function( k ){
        return this.slides[k];
    },
    renderSlideView : function (){
        this.slideView.setModel ( this.dm.activeSlide );
        this.slideView.render();
    },
    appendSlide : function (){
        var slide = new slideListView( this.dm.activeSlide );
        this.$el.find( '>.slide-list' ).append(
            slide.render()
        );

        if ( !this.slideView ) {
            this.slideView = new slideView( this.$el.find( '>.slide-view' ) );
        }
        this.renderSlideView();
    }
};


// slide
var slideListView = function( slideModel ){
    this.layers = [];
    this.slideModel = slideModel;
    this.$el = $('<div class="slide"><div class="name"/><div class="layers"/></div>');
    this.render = function (){
        this.$el.find('.name').html( this.slideModel.name );
        return this.$el;
    };

    this.domEvents = function (){
        var self = this;
        this.$el.on('click', function(){
           self.slideModel.parent.setActive( self.slideModel );
        });
    };

    this.layerAdded = function ( lm ){
        this.$el.find('.layers').html( 'layers count' + this.slideModel.layers.length );
    }
    this.slideModel.on('layer_added', this.layerAdded , this );
    this.domEvents();
};

var slideView = function(  $el  ){

    this.$el = $el;
    this.template = [
        '<button class="btn">add layer</button>',
        '<div class="layers"></div>'
    ].join('');


    this.setModel = function ( slideModel ){
        this.slideModel = slideModel;
        if ( !slideModel.layerAddedBinded ){
            this.slideModel.on('layer_added', this.appendLayer , this );
            slideModel.layerAddedBinded = true;
        }
    };

    this.domEvents = function (){
        var self = this;
        this.$el.on('click', '.btn', function(){
           self.slideModel.addLayer();
        });
    };


    this.appendLayer = function ( lm ){
        var layer = new layerView( lm );
        this.$el.find('.layers').append( layer.render() );
    }

    this.render = function ( slideModel ){
        this.$el.html( this.template );
        this.$el.prepend( this.slideModel.name );
        var self = this;
        this.slideModel.layers.forEach( function( lm ){
            self.appendLayer(lm);
        });
    }
    
    this.domEvents();
};


// layer
var  layerView = function ( layerModel ){

   this.layerModel = layerModel;
   this.$el = $('<div />');

   this.render = function (){
       this.$el.html( layerModel.name );
       return this.$el;
   };
};
