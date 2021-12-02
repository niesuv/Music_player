
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const playlist = $(".playlist");
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom : false,
  isRepeat : false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "7 Rings",
      singer: "Ariana Grande",
      path: "./asset/songs/7 Rings - Ariana Grande - Top 100 Pop USUK Hay Nhất - V.A - Playlist NhacCuaTui.mp3",
      image: "./asset/thumpnail/7rings.jpg"
    },
    {
      name: "Toxic",
      singer: "Boy with Uke",
      path: "./asset/songs/Toxic - BoyWithUke - Top 100 Pop USUK Hay Nhất - V.A - Playlist NhacCuaTui.mp3",
      image:
        "./asset/thumpnail/toxic.jpg"
    },
    {
      name: "Shape of You",
      singer: "Ed Sheeran",
      path:
        "./asset/songs/Shape Of You - Ed Sheeran - Top 100 Pop USUK Hay Nhất - V.A - Playlist NhacCuaTui.mp3",
      image: "./asset/thumpnail/ed.jpg"
    },
    {
      name: "Stay",
      singer: "LAROI, Justin Bieber",
      path: "./asset/songs/Stay - The Kid LAROI, Justin Bieber - Top 100 Pop USUK Hay Nhất - V.A - Playlist NhacCuaTui.mp3",
      image:
        "./asset/thumpnail/bieber.jpg"
    },
    
  ],
  
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
                        
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    // Handling when seek
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //next previous
    nextBtn.onclick = function () {
        if (_this.isRandom) {
          _this.getRandomSong()
        }
        else {
          _this.nextSong()
        }
        audio.play();
        _this.render()
      };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.getRandomSong()
      }
      else {
        _this.prevSong()
      }
      audio.play();
      _this.render()

    };

    // khi click vao random BTN

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom
      _this.setConfig('isRandom', _this.isRandom)
      randomBtn.classList.toggle('active' , _this.isRandom)
    }

   // khi bai hat ket thuc

   audio.onended = function () {
     if (_this.isRepeat) {
       audio.play()
     }
      else {nextBtn.click()  }
  }
  // khi click vao repeat BTN

  repeatBtn.onclick = function () {
    
    _this.isRepeat = !_this.isRepeat
    _this.setConfig('isRepeat', _this.isRepeat)
      
      repeatBtn.classList.toggle('active' , _this.isRepeat)
  }
  // bam vao bai hat chuyen  
      playlist.onclick = function (e) {
          songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')){
              if(songNode && !e.target.closest('.option')){
                  _this.currentIndex = Number(songNode.getAttribute('data-index'))
                  _this.loadCurrentSong()
                  _this.render()
                  audio.play()
                }
                if (e.target.closest('.option')){
                }
            }        
      }





  },
    //cac ham can thiet
  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  }
   , 
  setConfig: function(key, value){
    this.config[key] = value;
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
  }  
  ,
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  getRandomSong : function () {
    let newIndex 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex == this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  }
  ,
    
  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.loadCurrentSong();
    this.render();
    this.handleEvents()
    randomBtn.classList.toggle('active' , this.isRandom)
    repeatBtn.classList.toggle('active' , this.isRepeat)
}
};

app.start();