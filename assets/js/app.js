/*
    1. Render name/img of song
    2. Scroll top a playlist
    3. Play / pause / seek
    4. CD rotate
    5. Next / Prev
    6. Random song
    7. Next or Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playListElement = $('.playlist');
const fullPlayListElement = $('.full-playlist')
const currentSongName = $('.dashboard h2');
const currentSongSinger = $('.dashboard h5');
const cdThumb = $('.dashboard .cd-thumb');
const audioPlayer = $('#audio');
const progressBar = $('#progress');


const app = {
    isPlaying: false,

    songs : [
        {
            name: 'ngủ một mình',
            singer: 'HIEUTHUHAI ft Negav',
            musicPath: './assets/music/NguMotMinhtinhRatTinh-HIEUTHUHAINegavKewtiie-8397765.mp3',
            image: './assets/img/nguMotMinh.jpg'
        }, 
        {
            name: 'Bo Xì Bo',
            singer: 'Hoàng Thùy Linh',
            musicPath: './assets/music/BoXiBo-HoangThuyLinh-7702270.mp3',
            image: './assets/img/boXiBo.jpg'
        }, 
        {
            name: 'Chạy Khỏi Thế Giới Này',
            singer: 'DaLAB ft Phương Ly',
            musicPath: './assets/music/ChayKhoiTheGioiNay-DaLABPhuongLy-7574104.mp3',
            image: './assets/img/chayKhoiTheGioiNay.jpg'
        }, 
        {
            name: 'Chuyện Đôi Ta',
            singer: 'Emceel ft DaLAB',
            musicPath: './assets/music/ChuyenDoiTa-EmceeLDaLAB-7120974.mp3',
            image: './assets/img/chuyenDoiTa.jpg'
        }, 
        {
            name: 'Thuyền Quyên',
            singer: 'Diệu Kiên',
            musicPath: './assets/music/ThuyenQuyenOrinnRemix-DieuKien-7805774.mp3',
            image: './assets/img/thuyenQuyen.jpg'
        }, 
        {
            name: 'Tình yêu ngủ quên',
            singer: 'Hoàng Tôn ft LyHan',
            musicPath: './assets/music/TinhYeuNguQuen-HoangTonLyhan-7030537.mp3',
            image: './assets/img/tinhYeuNguQuen.jpg'
        }, 
        {
            name: 'Anh Đánh Rơi Người Yêu Này',
            singer: 'AMEE ft Andiez',
            musicPath: './assets/music/AnhDanhRoiNguoiYeuNay-Andiez-7625350.mp3',
            image: './assets/img/anhDanhRoiNguoiYeuNay.jpg'
        }, 
        {
            name: 'Ex\'s Hate Me',
            singer: 'AMEE ft Bray',
            musicPath: './assets/music/ExsHateMe-BRayMasewAMee-5878683.mp3',
            image: './assets/img/exHateMe.jpg'
        },
        {
            name: 'Ghé Vào Tai',
            singer: 'UMIE FreakyHo',
            musicPath: './assets/music/GheVaoTai-UMIEFreakyHo-8514373.mp3',
            image: './assets/img/gheVaoTai.jpg'
        }, 
        {
            name: 'Tại Ssao Lại Xinh Như Thế',
            singer: 'Juhi',
            musicPath: './assets/music/TaiSaoLaiXinhNhuThe-Juhi-8398166.mp3',
            image: './assets/img/taiSaoLaiXinh.jpg'
        }, 
    ],

    currentIndex: 0,

    renderPlayList: function() {
        var htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index == app.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="song--cd-thumb" style="background-image: url(${song.image})"></div> 

                    <div class="song-body">
                        <h4 class="song-name">${song.name}</h4>
                        <div class="song-singer">${song.singer}</div>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <img src="./assets/img/radio.png" alt="" class="playing-icon">
                </div>
            `
        })

        playListElement.innerHTML = htmls.join('');
        fullPlayListElement.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function() {
        currentSongName.innerText = this.currentSong.name;
        currentSongSinger.innerText = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image}`;
        audioPlayer.src = this.currentSong.musicPath;
    },

    handleEvents: function() {
        const playBtn = $('.btn-toggle-play');
        const playerElement = $('.player');

        // CD rotate / pause
        const cdThumbAnimate = cdThumb.animate([
            {trasnform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        // console.log(cdThumbAnimate);


        // Play / Pause audio
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audioPlayer.pause();
            }
            else {
                audioPlayer.play();
            }
        }

        audioPlayer.onplay = function() {
            app.isPlaying = true;
            cdThumbAnimate.play();
            playerElement.classList.add('playing');
        }
        
        audioPlayer.onpause = function() {
            app.isPlaying = false;
            cdThumbAnimate.pause();
            playerElement.classList.remove('playing');
        }

        // Seek audio
        progressBar.oninput = function() {
            const seekTime =  this.value / 100 * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }        

        // Ended song 
        audioPlayer.onended = function() { 
            nextSong();
            changeSong();
        }

        // Render a current and duration time
        audioPlayer.ontimeupdate = function() {
            // Render current time of current song
            currentMinute = new Intl.NumberFormat(
                "en-US",
                {
                    minimumIntegerDigits: 2
                }
            ).format(Math.floor(this.currentTime / 60));
            
            currentSecond = new Intl.NumberFormat(
                "en-US",
                {
                    minimumIntegerDigits: 2
                }
                ).format(Math.floor(this.currentTime % 60));;
                
            const currentTime = $('.time_current');
            currentTime.innerText = `${currentMinute}:${currentSecond}`;

            if(this.duration)
                progressBar.value = Math.floor(this.currentTime / this.duration * 100);
        }

        audioPlayer.onloadeddata = function() {
            // Render duration time of current song
            durationMinute = new Intl.NumberFormat(
                "en-US",
                {
                    minimumIntegerDigits: 2
                }
                ).format(Math.floor(audioPlayer.duration / 60));
                
            durationSecond = new Intl.NumberFormat(
                "en-US",
                {
                    minimumIntegerDigits: 2
                }
                ).format(Math.floor(audioPlayer.duration % 60));
                
            const durationTime = $('.time_duration');
            durationTime.innerText = `${durationMinute}:${durationSecond}`;
        }
        
        // Next / Prev events
        const prevBtn = $('.btn-prev');
        const nextBtn = $('.btn-next');
        
        changeSong = function() {
            app.loadCurrentSong();
            audioPlayer.play();
            app.renderPlayList();
            app.scrollActiveSong();
        }

        nextBtn.onclick = () => {
            nextSong();
            changeSong();
        }

        nextSong = function() {
            app.currentIndex++;

            if(app.currentIndex >= app.songs.length) 
                app.currentIndex = 0; 
        }

        prevBtn.onclick = () => {
            prevSong();
            changeSong();
        }

        prevSong = function() {
            app.currentIndex--;

            if(app.currentIndex < 0) 
                app.currentIndex = app.songs.length - 1;
        }

        // Random event
        const randomBtn = $('.btn-random');
        randomBtn.onclick = () => {
            do {
                var temp = Math.floor(Math.random() * this.songs.length);
            } while(temp == this.currentIndex)
            this.currentIndex = temp;
            changeSong();
        }

        // Repeat event
        const repeatBtn = $('.btn-repeat');
        repeatBtn.onclick = () => {
            repeatBtn.classList.toggle('repeat');

            if($('.btn.btn-repeat.repeat'))
                audioPlayer.loop = true;
            else
            audioPlayer.loop = false;

        }

        // Click to play 
        playListElement.onclick = function(e) {
            var songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.options')){
                if(songNode) {
                    app.currentIndex = songNode.dataset.index;
                    changeSong();
                }
            }
        }

        fullPlayListElement.onclick = function(e) {
            var songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.options')){
                if(songNode) {
                    app.currentIndex = songNode.dataset.index;
                    changeSong();
                }
            }
        }

        // Open full playlist

        const menuIcon = $('.player-header > i');
        menuIcon.onclick = function() {
            $('.full-playlist').classList.toggle('open');
        }
    },

    scrollActiveSong: function() {
        setTimeout(() => {
            $('.playlist > .song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 200)

        setTimeout(() => {
            $('.full-playlist > .song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 200)
    },

    start: function() { 
        this.defineProperties();

        this.loadCurrentSong();

        this.handleEvents();

        this.renderPlayList();
    },

}

app.start();
