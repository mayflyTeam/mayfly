import {execa} from 'execa';

const PATHTODOCKERCOMPOSE = '../../sample-config/compose';

(async () => {
  try {
    await execa('docker', ['compose', 'pull'], {
      cwd: PATHTODOCKERCOMPOSE
    });
    console.log('Docker Compose pull completed.');
    execa('docker', ['compose', 'up'], {
      cwd: PATHTODOCKERCOMPOSE
    });
    console.log('Docker Compose up completed.');
    setTimeout(async () => {
      const { stdout, stderr } = await execa('docker', [
        'run',
        '--init',
        '--network',
        'plane',
        'plane/cli',
        '--nats=nats://nats',
        'spawn',
        'plane.test',
        'ghcr.io/drifting-in-space/demo-image-drop-four',
      ], {
        shell: true,
      });
      console.log('Docker run executed successfully.');
      console.log('Standard Output:', stdout);
      const backendId = stdout.split('Backend ID: ')[1];
      console.log('Standard Error:', stderr);
      const url = `http://localhost:8080/_plane_backend=${backendId}/`
      console.log(url);
    }, 5000)
  } catch (error) {
    console.error('Error running Docker Compose pull:', error);
    return {"error": "docker problem"}
  }
})();
