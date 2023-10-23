import { execa } from 'execa';

const PATHTODOCKERCOMPOSE = './sample-config/compose/';

export const getUrl = async (service) => {

  try {
    const crAddress = service === 
    'dropFour' ? 'ghcr.io/drifting-in-space/demo-image-drop-four' :
    'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787' 
    console.log(crAddress)   
    await execa('docker', ['compose', 'pull'], {
      cwd: PATHTODOCKERCOMPOSE
    });
    // console.log('Docker Compose pull completed.');
    execa('docker', ['compose', 'up'], {
      cwd: PATHTODOCKERCOMPOSE
    });
    // console.log('Docker Compose up completed.');
    const backendPromise = new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const { stdout, stderr } = await execa('docker', [
            'run',
            '--init',
            '--network',
            'plane',
            'plane/cli',
            '--nats=nats://nats',
            'spawn',
            'plane.test',
            crAddress,
          ], {
            shell: true,
          });
          // console.log('Docker run executed successfully.');
          // console.log('Standard Output:', stdout);
          
          const backendId = stdout.split('Backend ID: ')[1];
          // console.log('Standard Error:', stderr);

          const url = `http://localhost:8080/_plane_backend=${backendId}/`
          const output = backendId ? {backendId, url, error: false} : {error: "error from Plane drone"};
          resolve(output);
        } catch (error) {
          reject(error);
        }
      }, 5000);
    });

  return await backendPromise;
  } catch (error) {
    console.error('Error running Docker Compose pull:', error);
    return {"error": "docker problem"}
  }
};

// getUrl()