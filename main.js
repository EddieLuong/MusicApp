const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const PLAYER_STORAGE_KEY = 'F8_Player'

// Select elements
const songs = $$('.song');
const dashboard = $('.dashboard');
const playlist = $('.playlist')
const musicplayer = $('.music_player');
const cd = $('.cd-rolling');
const cdWidth = cd.offsetWidth;
const cdHeight = cd.offsetHeight;
const heading = $('header h3');
const audio = $('#audio');
const playBtn = $('.icon-play');
const pauseBtn = $('.icon-pause');
const progress = $('.progress');
const progressChange = document.head.appendChild(document.createElement("style"));
const next = $('.fa-step-forward');
const prev = $('.fa-step-backward');
const random = $('.fa-random');
const repeat = $('.fa-redo-alt');


const app ={
    currentIndex:2,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            id: 1,
            name: "Ái Nộ",
            singer: "Yến Tatoo, Masew, Great",
            path: "./assets/Song/mp3_path/Ái Nộ.mp3",
            image: './assets/Song/img_thumnail/Ái nộ.jpg'
        },
        {
            id: 2,
            name: "Khu Tao Sống",
            singer: "Wowy, Karik",
            path: "./assets/Song/mp3_path/KhuTaoSong-KarikWowy-2424316.mp3",
            image: './assets/Song/img_thumnail/Khu tao sống.jpg'
        },
        {
            id: 3,
            name: "Sắp 30",
            singer: "Trịnh Đình Quang",
            path: "./assets/Song/mp3_path/Sắp 30.mp3",
            image: './assets/Song/img_thumnail/Sắp 30.jpg'
        },
        {
            id: 4,
            name: "Dancing With Your Ghost",
            singer: "Sasha Alex Sloan",
            path: "./assets/Song/mp3_path/Song4.DancingWithYourGhost.mp3",
            image: './assets/Song/img_thumnail/Song4_dancingwithghost.jpg'
        },
        {
            id: 5,
            name: "Ghé Qua",
            singer: "Dick, Tofu, PC",
            path: "./assets/Song/mp3_path/Song4_Ghé qua.mp3",
            image: './assets/Song/img_thumnail/Ghé qua.jpg'
        },
        {
            id: 6,
            name: "Stay",
            singer: "The Kid LAROI, Justin Bieber",
            path: "./assets/Song/mp3_path/Stay.mp3",
            image: './assets/Song/img_thumnail/Song3_Stay.jpg'
        },
        {
            id: 7,
            name: "Yêu 5",
            singer: "Rhymastic",
            path: "./assets/Song/mp3_path/Yêu 5.mp3",
            image: './assets/Song/img_thumnail/Yêu 5.jpg'
        },
        {
            id: 8,
            name: "Yêu Xa",
            singer: "Vũ Cát Tường",
            path: "./assets/Song/mp3_path/Yêu Xa-Vũ cát tường.mp3",
            image: './assets/Song/img_thumnail/Yêu xa.jpg'
        },
    
    
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    }
    ,
    render: function(){
        const htmls = this.songs.map((song,index)=>{
            return `
            <div class="song ${index ===this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');">
                </div>
                    <div class="infor">
                        <h4>${song.name}</h4>
                        <p>${song.singer}</p>
                    </div>
                <div class="option">
                 <i class="ti-more-alt"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join(' ');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    }
    ,
    handleEvents: function(){
        let _this = this;
        // Xử lý cd quay/dừng
        const cdThumbAnimate = cd.animate([
            {transform: 'rotate(360deg)'}
        ],
        {
            duration:20000,
            iterations:Infinity
        })
        cdThumbAnimate.pause()
        musicplayer.onscroll = function(){
            const newWidth = cdWidth - musicplayer.scrollTop;
            const newHeight = cdHeight - musicplayer.scrollTop;
            cd.style.width = newWidth>0 ? newWidth + 'px' :0;
            cd.style.height = newHeight>0 ? newHeight + 'px' :0;
            cd.style.opacity = newWidth/cdWidth;
        }
        // animation when play
        const playSongAction = function(){
            playBtn.classList.add('playing');
            pauseBtn.classList.remove('pausing');
            cdThumbAnimate.play();
        }
        const pauseSongAction = function(){
            playBtn.classList.remove('playing');
            pauseBtn.classList.add('pausing');
            cdThumbAnimate.pause();
        }
        // play song
        playBtn.onclick = function(){
            playSongAction();
            audio.play();
            
        }
        // Pause song
        pauseBtn.onclick = function(){
            pauseSongAction();
            audio.pause();
        }
        // Next song
        next.onclick = function(){
            playSongAction();
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong();
            }
            _this.render()
            audio.play();
            _this.scrollToActiveSong();
        }
        // Previous song
        prev.onclick = function(){
            playSongAction();
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            _this.render()
            audio.play();
            _this.scrollToActiveSong();
        }
        // Random song
        random.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom);
            random.classList.toggle('active',_this.isRandom);
        }
        // lặp lại bài hát
        repeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeat.classList.toggle('active',_this.isRepeat)
        }
        // Xử lý khi phát hết bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                next.onclick(); 
            }
        }
        
        // Khi progress thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime/audio.duration)*100);
                progress.value = progressPercent;
                progressChange.innerHTML = `.progress::after{width: ${progress.value}%;}`
                
            }
            
        }
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render()
                    playSongAction();
                    audio.play();
                }
                // Xử lý khi click vào Song option
                if(e.target.closest('.option')){

                }
            }
        }
        //tua bài hát
        progress.oninput = function(){
            audio.currentTime = progress.value*audio.duration/100;
        }
        
    },
    
    // loadCofig

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }
        while(this.currentIndex == newIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function(){
        if(this.currentIndex ===0){
            musicplayer.scrollTop = 0;
        }
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            }
            );
        },300)
    }
    ,
    loadCurrentSong:function(){
        heading.textContent = this.currentSong.name;
        cd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        -- this.currentIndex;
        this.currentIndex <0 ? this.currentIndex = this.songs.length -1 : 0;

        this.loadCurrentSong();
    },

    start: function(){
        this.loadConfig();
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Xử lý các sự kiện
        this.handleEvents();
        // Render list songs ra màn hình
        this.render();
        // Tải bài hát đầu tiên
        this.loadCurrentSong();
        repeat.classList.toggle('active',this.isRepeat)
        random.classList.toggle('active',this.isRandom)
    }
}
app.start();

