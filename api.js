import { execa } from 'execa'
// import express from 'express'
// import cors from 'cors'
// require("dotenv").config();
// const app = express();

(async () => {
  try {
    await execa('docker', ['compose', 'pull'], {
      cwd: './sample-config/compose'
    });
    console.log('Docker Compose pull completed.');
    execa('docker', ['compose', 'up'], {
      cwd: './sample-config/compose'
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
      console.log('Standard Output:');
      console.log(stdout);
      console.log('Standard Error:');
      console.log(stderr);
    }, 15000)
  } catch (error) {
    console.error('Error running Docker Compose pull:', error);
  }
})();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cors());

// const router = require('./router.js')
// app.use('/', router)

// const port = process.env.PORT
// app.listen(port, () => {
//   console.log('listening on port', port);
// });


/*
Allow the user to CRUD for services
Allow the user to spawn a backend from a service
*/



// (async () => {
//   try {
//     await execa('docker', ['compose', 'up'], {
//       cwd: './sample-config/compose'
//     });
//     console.log('Docker Compose up completed.');
//   } catch (error) {
//     console.error('Error running Docker Compose up:', error);
//   }
// })();

// (async () => {
//   try {
//     const { stdout, stderr } = await execa('docker', [
//       'run',
//       '--init',
//       '--network',
//       'plane',
//       'plane/cli',
//       '--nats=nats://nats',
//       'spawn',
//       'plane.test',
//       'ghcr.io/drifting-in-space/demo-image-drop-four',
//     ], {
//       shell: true,
//     });
//     console.log('Docker run executed successfully.');
//     console.log('Standard Output:');
//     console.log(stdout);
//     console.log('Standard Error:');
//     console.log(stderr);
//   } catch (error) {
//     console.error('Error running Docker run:', error);
//   }
// })();


// alias plane-cli="docker run --init --network plane plane/cli --nats=nats://nats"
// plane-cli spawn plane.test ghcr.io/drifting-in-space/demo-image-drop-four