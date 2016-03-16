import Relay from 'react-relay';
import App from '../components/App';

export default class extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query { viewer }
    `,
  };
  static routeName = 'AppHomeRoute';
}
