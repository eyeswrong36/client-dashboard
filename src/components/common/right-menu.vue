<script>
/**
 * NOTE: This is the same as VMenu but with a workaround that
 * actually applies the correct style when repositioning the
 * component to the right.
 *
 * Reference issue: https://github.com/vuetifyjs/vuetify/issues/13017
 */
import VMenu from 'vuetify/lib/components/VMenu/VMenu';

export default {
  name: 'RightMenu',
  extends: VMenu,
  computed: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    styles() {
      return {
        maxHeight: this.calculatedMaxHeight,
        minWidth: this.calculatedMinWidth,
        maxWidth: this.calculatedMaxWidth,
        top: this.calculatedTop,
        right:
          document.body.clientWidth - this.dimensions.activator.right + 'px',
        transformOrigin: this.origin,
        zIndex: this.zIndex || this.activeZIndex,
      };
    },
  },
};
</script>
