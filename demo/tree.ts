import Row from "./components/Row";
import Button from "./components/Button";

export default {
  component: Row,
  children: [
    {
      component: Row,
      children: [
        {
          component: Button,
          props: { text: 'Whut' },
        },
        {
          component: Button,
          props: { text: 'react-ui-tree.css' },
        },
        {
          component: Button,
          props: { text: 'react-ui-tree.js' },
        },
        {
          component: Button,
          props: { text: 'tree.js' },
        },
        {
          component: Button,
          props: { text: 'xsd.js' },
        }
      ]
    },
    {
      component: Row,
      accept: () => false,
      children: [
        {
          component: Button,
          props: { text: 'lol.js' },
        }
      ]
    }
  ]
};
