import { Spawn, Squish, ScheduledResponse } from '../types/nats-types';
import connectNats from './nats-connection';
interface HatchResponse {
  url: string | null;
  error: string | null;
}

export const spawn = async (image: string): Promise<HatchResponse> => {
  const message: Spawn = {
    cluster: "taishan.website", 
    max_idle_secs: 60,
    metadata: {},
    executable: {
      'image': image,
      env: {},
    }
  };

  try {
    const nc = await connectNats()
    const reply = await nc.request('cluster.taishan_website.schedule', JSON.stringify(message));
    const responseData: ScheduledResponse = JSON.parse(reply.data.toString());
    const url: string = `http://${responseData.Scheduled.backend_id}.taishan.website:8080/`;
    const result: HatchResponse = {
      url,
      error: null
    };
    return result
  } catch(e) {
    let errorMessage: string | null = null;

    if (e instanceof Error && typeof e.message === 'string') {
      errorMessage = e.message;
    } else {
      errorMessage = "An error occurred";
    }

    const result: HatchResponse = {
      url: null,
      error: errorMessage
    };
    console.error(result)
    return result;
  }
}

export const squish = async (backend_id: string): Promise<string|null> => {
  const message: Squish = {
    cluster_id: "taishan.website",
    'backend_id': backend_id,
  };

  try {
    const nc = await connectNats()
    await nc.request(`cluster.taishan_website.backend.${backend_id}.terminate`, JSON.stringify(message));
    return `Successfully squished backend ${backend_id} in cluster ${"taishan.website"}`;
  } catch(e) {
    console.error(e);
    return null;
  }
}