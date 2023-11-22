import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
            <h1>Header</h1>
            <Component {...pageProps} />;
          </div>
};

AppComponent.getIntialProps = async appContext => {
  const client =  buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if(appContext.Component.getIntialProps){
    pageProps = await appContext.Component.getIntialProps(appContext.ctx);
  }
 
  return {
    pageProps,
    ...data
  }
}

export default AppComponent;