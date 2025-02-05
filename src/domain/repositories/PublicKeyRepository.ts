import { PublicKey } from "../entities";

export interface PublicKeyRepository {
  createPublicKey(publicKey: PublicKey): Promise<PublicKey>;
  updatePublicKeyByDevice(publicKey: PublicKey): Promise<PublicKey[]>;
}
