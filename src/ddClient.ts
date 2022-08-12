import { ApiClient } from "./ts-ddng-client/src/index";

const DREBEDENGI_API_ID = process.env.DREBEDENGI_API_ID
  ? process.env.DREBEDENGI_API_ID
  : "fakeApiId";
const DREBEDENGI_USERNAME = process.env.DREBEDENGI_USERNAME
  ? process.env.DREBEDENGI_USERNAME
  : "fakeUsername";
const DREBEDENGI_PASSWORD = process.env.DREBEDENGI_PASSWORD
  ? process.env.DREBEDENGI_PASSWORD
  : "fakePassword";

const client = new ApiClient(
  DREBEDENGI_API_ID,
  DREBEDENGI_USERNAME,
  DREBEDENGI_PASSWORD
);

export default client;
