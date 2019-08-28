<template>
	<transition>
		<div class="Popup" v-if="visible">
			<span>{{message}}</span>
		</div>
	</transition>
</template>

<script type="text/babel">
  import './popup.scss'
	export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 2000,
        
        onClose: null,
        showClose: false,
        closed: false,
        timer: null,
        
      };
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      }
    },
    mounted() {
      this.startTimer();
    }
  };
</script>
<style>
	
</style>
