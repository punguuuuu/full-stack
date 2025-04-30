class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.galleryRef = React.createRef();
        this.state = { modalImage: "", modalCaption: "", isModalOpen: false, canScrollLeft: false,
            canScrollRight: false, fade: false };
    }

    updateBtn = () => {
        const gallery = this.galleryRef.current;
        if (gallery) {
            this.setState({
                canScrollLeft: gallery.scrollLeft > 0,
                canScrollRight: gallery.scrollLeft + gallery.clientWidth < gallery.scrollWidth
            });
        }
    }

    scrollGallery = (direction) => {
        const gallery = this.galleryRef.current;
        let scrollDistance = 0;
        if(window.innerWidth <= 800){
            const images = document.querySelectorAll("img");
            let imgWidth = images[0].clientWidth + (window.innerWidth * 0.01 * 2);
            scrollDistance = imgWidth;
        } else if (window.innerWidth <= 1000){
            scrollDistance = 800;
        } else {
            scrollDistance = 1200;
        }

        if (gallery) {
            gallery.scrollBy({ left: direction * scrollDistance, behavior: "smooth" });
            setTimeout(this.updateBtn, 600);
        }
    };

    componentDidMount(){
        setTimeout(this.updateBtn, 600);
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.images !== this.props.images) {
            this.galleryRef.current.scrollLeft = 0;
            this.updateBtn();
            this.setState({ fade: false }, () => {
                setTimeout(() => this.setState({ fade: true }), 10);
            });
        }
    }

    openModal = (image) => {
        this.setState(
            { 
                modalImage: image.src, 
                modalCaption: image.alt, 
                isModalOpen: true 
            },
            () => {
                let modal = document.getElementById("modal");
                if (modal) {
                    modal.style.display = "flex";
                }
            }
        );
    };
    
    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    render() {
        return (
            <div className={`gallery-container ${this.state.fade ? "fade-in" : ""}`}>
                <a className={`prev ${!this.state.canScrollLeft ? "disabled" : ""}`}  onClick={() => this.scrollGallery(-1)}>&#10094;</a>
                <div className="gallery" ref={this.galleryRef}>
                    {this.props.images.map((image, index) => (
                        <img 
                            key={index} 
                            src={image.src} 
                            alt={image.alt} 
                            onClick={() => this.openModal(image)} 
                        />
                    ))}
                </div>

                {this.state.isModalOpen && (
                    <div id="modal" className="modal">
                        <span className="close" onClick={this.closeModal}>X</span>
                        <img id="image" className="modal-content" src={this.state.modalImage} 
                            alt={this.state.modalCaption} />
                        <div id="caption">{this.state.modalCaption}</div>
                    </div>
                )}
                <a className={`next ${!this.state.canScrollRight ? "disabled" : ""}`}  onClick={() => this.scrollGallery(1)}>&#10095;</a>
            </div>
        );
    }
}

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGallery: foodGallery.images,
            currentDesc: foodGallery.desc,
            fade: false,
        };
    }

    switchGallery = (newGallery) => {
        if(this.state.currentDesc === newGallery.desc){
            return;
        }

        this.setState({ 
            currentGallery: newGallery.images, 
            currentDesc: newGallery.desc,
            fade: false,
        }, () => {setTimeout(()=>(this.setState({fade: true})),10)});
    };
    
    render(){
        return (
            <div>
                <div id="category">
                    <a onClick={() => this.switchGallery(foodGallery)}>Food</a>
                    <a onClick={() => this.switchGallery(catGallery)}>Cats</a>
                    <a onClick={() => this.switchGallery(randomGallery)}>Random stuff</a>
                </div>
                
                <Gallery images={this.state.currentGallery} />
                
                <p style={{ marginTop: "40px"}} className={`desc ${this.state.fade ? "fade-in" : ""}`}>{this.state.currentDesc}</p>
            </div>
        );
    }
}

const foodGallery = {
    desc: "I like drawing faces on food",
    images: [
        {src:"./assets/images/food/ginger.png", alt:"Gingerbreadman"},
        {src:"./assets/images/food/lemon.png", alt:"Lemon"},
        {src:"./assets/images/food/egg.png", alt:"Sunny side up"},
        {src:"./assets/images/food/pancake.png", alt:"Fluffy pancake"},
        {src:"./assets/images/food/pizza.png", alt:"Pizza slice"},
        {src:"./assets/images/food/sushi.png", alt:"Sushi"},
        {src:"./assets/images/food/pretzel.png", alt:"Pretzel"},
        {src:"./assets/images/food/tomato.png", alt:"Tomato"},
        {src:"./assets/images/food/ketchup.png", alt:"Ketchup"},
    ]
};

const catGallery = {
    desc: "Cats in random places",
    images: [
        {src:"./assets/images/cat/roomba.png", alt:"Roomba"},
        {src:"./assets/images/cat/moai.png", alt:"Moai"},
        {src:"./assets/images/cat/potat.png", alt:"Cat in potato bag"},
        {src:"./assets/images/cat/catpuccino.png", alt:"Catpuccino"},
        {src:"./assets/images/cat/pool.png", alt:"Cat in pool"},
        {src:"./assets/images/cat/harshbrown.png", alt:"Harshbrown"},
    ]
};

const randomGallery = {
    desc: "Random stuff with random captions",
    images: [
        {src:"./assets/images/random/share food.png", alt:"Share your food"},
        {src:"./assets/images/random/debt.png", alt:"Generational debt"},
        {src:"./assets/images/random/cactus.png", alt:"Cactus"},
        {src:"./assets/images/random/sea urchin.png", alt:"Sea urchin"},
        {src:"./assets/images/random/toothpaste.png", alt:"Toothpaste"},
        {src:"./assets/images/random/i know.png", alt:"I know"},
        {src:"./assets/images/random/not listening.png", alt:"Not listening"},
        {src:"./assets/images/random/lock in.png", alt:"Lock in"},
        {src:"./assets/images/random/posture.png", alt:"Posture reveal"},
        {src:"./assets/images/random/i dont.png", alt:"I dont get it"},
        {src:"./assets/images/random/i miss my brain.png", alt:"I miss my brain"},
    ]
};

ReactDOM.render(
    <React.StrictMode>
        <Category />
    </React.StrictMode>,
    document.getElementById("gallery")
);