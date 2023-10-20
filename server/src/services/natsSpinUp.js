import nc from '../../NATS.js'

export const getUrlFromNats = async () => {

  const crAddress = 'ghcr.io/drifting-in-space/demo-image-drop-four'
    
  const message = JSON.stringify({
    cluster: "plane.test",
    max_idle_secs: 30,
    metadata: {},
    executable: {
        image: crAddress,
        env: {},
    }
  })

  const reply = await nc.request('cluster.plane_test.schedule', message, {max: 1});
  const data = JSON.parse(reply.data);
  console.log('response data:', data)
  const url = `http://localhost:8080/_plane_backend=${data.Scheduled.backend_id}/`
  return url;


}
