export interface ObjectInfoRoot {
  [key: string]: ObjectNode;
}

export interface ObjectNode {
  input: Input;
  output: Array<string[] | string>;
  output_is_list: boolean[];
  output_name: string[];
  name: string;
  display_name: string;
  description: string;
  category: string;
  output_node: boolean;
}

export type InputDefinition = Array<
  Array<PurpleRequired | number | string> | FluffyRequired | string
>;

export interface Input {
  required?: { [key: string]: InputDefinition };
  hidden?: Hidden;
  optional?: Optional;
}

export interface Hidden {
  prompt?: Prompt;
  extra_pnginfo?: ExtraPnginfo;
  id?: ID;
  unique_id?: ID;
  my_unique_id?: ID;
  version?: string;
  values_insert_saved?: Array<string[]>;
}

export enum ExtraPnginfo {
  ExtraPnginfo = "EXTRA_PNGINFO",
}

export enum ID {
  UniqueID = "UNIQUE_ID",
}

export enum Prompt {
  Prompt = "PROMPT",
}

export interface Optional {
  mask?: string[];
  anything?: Array<VeClass | string>;
  anything2?: Array<VeClass | string>;
  anything3?: Array<VeClass | string>;
  title_regex?: Array<EsbjergCougar | ArakGroundhog>;
  input_regex?: Array<EsbjergCougar | ArakGroundhog>;
  group_regex?: Array<EsbjergCougar | ArakGroundhog>;
  "+ve"?: Array<VeClass | string>;
  "-ve"?: Array<VeClass | string>;
  text_2?: Array<ChiangMaiGoose | ArakGroundhog>;
  text_3?: Array<ChiangMaiGoose | ArakGroundhog>;
  text_4?: Array<ChiangMaiGoose | ArakGroundhog>;
  column_labels?: Array<EsbjergCougar | string>;
  row_labels?: Array<EsbjergCougar | string>;
  images_grid_annotation?: string[];
  prev_timestep_kf?: string[];
  strength?: Array<BarcelonaHawaiianMonkSeal | string>;
  cn_weights?: string[];
  latent_keyframe?: string[];
  null_latent_kf_strength?: Array<BarcelonaHawaiianMonkSeal | string>;
  inherit_missing?: Array<CalculateHashClass | string>;
  guarantee_usage?: Array<CalculateHashClass | string>;
  mask_optional?: string[];
  prev_latent_kf?: string[];
  latent_optional?: string[];
  print_keyframes?: Array<CalculateHashClass | string>;
  timestep_kf?: string[];
  latent_kf_override?: string[];
  weights_override?: string[];
  model_optional?: string[];
  timestep_keyframe?: string[];
  sparse_method?: string[];
  tk_optional?: string[];
  image_load_cap?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  start_index?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  a?: Array<PurpleA | string>;
  b?: Array<PurpleA | string>;
  c?: Array<PurpleA | string>;
  text_c?: Array<Text1Class | ArakGroundhog>;
  detailer_hook?: DetailerHook[];
  inpaint_model?: Array<InpaintModelClass | string>;
  noise_mask_feather?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  refiner_basic_pipe_opt?: string[];
  sam_model_opt?: string[];
  segm_detector_opt?: string[];
  model?: Array<string[] | EsbjergCougar | string>;
  clip?: string[];
  vae?: string[];
  positive?: Array<ChiangMaiGoose | string>;
  negative?: Array<ChiangMaiGoose | string>;
  bbox_detector?: Array<string[] | EsbjergCougar | string>;
  sam_model?: string[];
  segm_detector?: string[];
  refiner_model?: string[];
  refiner_clip?: string[];
  refiner_positive?: string[];
  refiner_negative?: string[];
  upscale_model_opt?: string[];
  pk_hook_opt?: string[];
  full_sampler_opt?: string[];
  pk_hook_base_opt?: string[];
  pk_hook_mask_opt?: string[];
  pk_hook_full_opt?: string[];
  masking_mode?: Array<string[]>;
  segs_pivot?: Array<string[]>;
  post_dilation?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  segs_preprocessor?: string[];
  control_image?: string[];
  combine_embeds?: Array<string[]>;
  neg_image?: string[];
  cropped_image_opt?: string[];
  cropped_mask_opt?: string[];
  crop_region_opt?: string[];
  bbox_opt?: string[];
  control_net_wrapper_opt?: string[];
  confidence_opt?: Array<BarcelonaHawaiianMonkSeal | string>;
  label_opt?: Array<AOptionalClass | ArakGroundhog>;
  sampler_opt?: string[];
  vae_opt?: string[];
  mask1_opt?: string[];
  images2_opt?: string[];
  mask2_opt?: string[];
  images3_opt?: string[];
  mask3_opt?: string[];
  images4_opt?: string[];
  mask4_opt?: string[];
  input1?: string[];
  upscaler_hook_opt?: string[];
  ref_image_opt?: string[];
  fallback_image_opt?: string[];
  filter_in_segs_opt?: string[];
  filter_out_segs_opt?: string[];
  tt_value?: string[];
  ff_value?: string[];
  signal?: string[];
  any_input?: string[];
  signal_opt?: string[];
  boolean_value?: Array<HammerfestPonies | string>;
  int_value?: Array<HammerfestPonies | PortoCamel>;
  float_value?: Array<HammerfestPonies | string>;
  string_value?: Array<HammerfestPonies | ArakGroundhog>;
  boost?: Array<string[] | BoostClass | string>;
  noise_opt?: string[];
  name_opt?: Array<AOptionalClass | ArakGroundhog>;
  load_always?: Array<InpaintModelClass | string>;
  faceid_v2?: Array<CalculateHashClass | string>;
  weight_v2?: Array<BarcelonaHawaiianMonkSeal | string>;
  neg_embeds?: string[];
  clip_vision?: string[];
  insightface?: string[];
  prev_progress_latent_opt?: string[];
  mode?: Array<string[]>;
  multiplier1?: Array<BarcelonaHawaiianMonkSeal | string>;
  override_lora_name?: Array<HammerfestPonies | ArakGroundhog>;
  lora_stack?: Lora[];
  lora_1?: Lora[];
  lora_2?: Lora[];
  prefix?: Array<PurpleCkptName | ArakGroundhog>;
  suffix?: Array<PurpleCkptName | ArakGroundhog>;
  text_in_opt?: Array<HammerfestPonies | ArakGroundhog>;
  parameter_index?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  filename?: Array<ChiangMaiGoose | ArakGroundhog>;
  path?: Array<ChiangMaiGoose | ArakGroundhog>;
  model_name?: Array<string[] | HammerfestPonies>;
  vae_name?: Array<string[] | EsbjergCougar>;
  seed?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  steps?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  cfg?: Array<CFGClass | string>;
  sampler_name?: Array<string[] | HammerfestPonies>;
  scheduler?: Array<string[] | HammerfestPonies>;
  lora_name?: string;
  width?: Array<BarcelonaHawaiianMonkSeal | string>;
  height?: Array<BarcelonaHawaiianMonkSeal | string>;
  extension?: Array<string[]>;
  calculate_hash?: Array<CalculateHashClass | string>;
  resource_hash?: Array<CalculateHashClass | string>;
  lossless_webp?: Array<CalculateHashClass | string>;
  jpg_webp_quality?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  date_format?: Array<ChiangMaiGoose | ArakGroundhog>;
  time_format?: Array<ChiangMaiGoose | ArakGroundhog>;
  save_metadata_file?: Array<CalculateHashClass | string>;
  extra_info?: Array<ChiangMaiGoose | ArakGroundhog>;
  model_version?: Array<string[] | EsbjergCougar>;
  config_name?: Array<string[] | EsbjergCougar>;
  refiner_start?: Array<BarcelonaHawaiianMonkSeal | string>;
  positive_ascore?: Array<BarcelonaHawaiianMonkSeal | string>;
  negative_ascore?: Array<BarcelonaHawaiianMonkSeal | string>;
  aspect_ratio?: Array<string[] | EsbjergCougar>;
  batch_size?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  text_g?: Array<Text1Class | ArakGroundhog>;
  text_l?: Array<Text1Class | ArakGroundhog>;
  image_load_limit?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  parameter?: Array<string[] | EsbjergCougar>;
  value_type?: Array<string[] | EsbjergCougar>;
  last_lora?: string[];
  source_image?: string[];
  face_model?: string[];
  image?: string[];
  a_optional?: Array<AOptionalClass | ArakGroundhog>;
  b_optional?: Array<AOptionalClass | ArakGroundhog>;
  trigger?: Array<CalculateHashClass | string>;
  part1?: Array<ChiangMaiGoose | ArakGroundhog>;
  part2?: Array<ChiangMaiGoose | ArakGroundhog>;
  part3?: Array<ChiangMaiGoose | ArakGroundhog>;
  part4?: Array<ChiangMaiGoose | ArakGroundhog>;
  separator?: Array<ChiangMaiGoose | ArakGroundhog>;
  input_path?: Array<ChiangMaiGoose | ArakGroundhog>;
  folder_path?: Array<ChiangMaiGoose | ArakGroundhog>;
  prompt_positive?: Array<ChiangMaiGoose | ArakGroundhog>;
  prompt_negative?: Array<ChiangMaiGoose | ArakGroundhog>;
  style_positive?: Array<ChiangMaiGoose | ArakGroundhog>;
  style_negative?: Array<ChiangMaiGoose | ArakGroundhog>;
  preset?: Array<string[]>;
  switch_1?: Array<string[] | ChiangMaiGoose | ArakGroundhog>;
  controlnet_1?: Array<string[]>;
  controlnet_strength_1?: Array<BarcelonaHawaiianMonkSeal | string>;
  start_percent_1?: Array<BarcelonaHawaiianMonkSeal | string>;
  end_percent_1?: Array<BarcelonaHawaiianMonkSeal | string>;
  switch_2?: Array<string[] | ChiangMaiGoose | ArakGroundhog>;
  controlnet_2?: Array<string[]>;
  controlnet_strength_2?: Array<BarcelonaHawaiianMonkSeal | string>;
  start_percent_2?: Array<BarcelonaHawaiianMonkSeal | string>;
  end_percent_2?: Array<BarcelonaHawaiianMonkSeal | string>;
  switch_3?: Array<string[] | ChiangMaiGoose | ArakGroundhog>;
  controlnet_3?: Array<string[]>;
  controlnet_strength_3?: Array<BarcelonaHawaiianMonkSeal | string>;
  start_percent_3?: Array<BarcelonaHawaiianMonkSeal | string>;
  end_percent_3?: Array<BarcelonaHawaiianMonkSeal | string>;
  image_1?: string[];
  image_2?: string[];
  image_3?: string[];
  controlnet_stack?: string[];
  model_stack?: string[];
  pipe?: string[];
  any1?: string[];
  any2?: string[];
  any3?: string[];
  any4?: string[];
  ch1?: string[];
  ch2?: string[];
  ch3?: string[];
  ch4?: string[];
  ch5?: string[];
  ch6?: string[];
  ch7?: string[];
  ch8?: string[];
  pos?: string[];
  neg?: string[];
  latent?: string[];
  controlnet?: string[];
  upscale_factor?: Array<BarcelonaHawaiianMonkSeal | string>;
  upscale_stack?: string[];
  output_path?: Array<ChiangMaiGoose | ArakGroundhog>;
  bg_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  color1_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  color2_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  face_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  line_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  start_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  end_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  color0_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  outline_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  shape_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  font_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  tint_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  border_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  image_4?: string[];
  fill_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  drop_percentage?: Array<BarcelonaHawaiianMonkSeal | string>;
  bar_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  images?: string[];
  custom_panel_layout?: Array<ChiangMaiGoose | ArakGroundhog>;
  panel_color_hex?: Array<ChiangMaiGoose | ArakGroundhog>;
  image1?: string[];
  image2?: string[];
  image3?: string[];
  image4?: string[];
  latent1?: string[];
  latent2?: string[];
  conditioning1?: string[];
  conditioning2?: string[];
  clip1?: string[];
  clip2?: string[];
  model1?: string[];
  model2?: string[];
  control_net1?: string[];
  control_net2?: string[];
  VAE1?: Array<HammerfestPonies | string>;
  VAE2?: Array<HammerfestPonies | string>;
  text1?: Array<Text1Class | ArakGroundhog>;
  text2?: Array<Text1Class | ArakGroundhog>;
  text3?: Array<HammerfestPonies | ArakGroundhog>;
  text4?: Array<HammerfestPonies | ArakGroundhog>;
  image_batch?: string[];
  txt2img?: string[];
  img2img?: string[];
  latent_upscale?: string[];
  image_upscale?: string[];
  delimiter?: Array<ChiangMaiGoose | ArakGroundhog>;
  find1?: Array<ChiangMaiGoose | ArakGroundhog>;
  replace1?: Array<ChiangMaiGoose | ArakGroundhog>;
  find2?: Array<ChiangMaiGoose | ArakGroundhog>;
  replace2?: Array<ChiangMaiGoose | ArakGroundhog>;
  find3?: Array<ChiangMaiGoose | ArakGroundhog>;
  replace3?: Array<ChiangMaiGoose | ArakGroundhog>;
  replacement_text?: Array<ChiangMaiGoose | ArakGroundhog>;
  test_string?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_if_true?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_if_false?: Array<ChiangMaiGoose | ArakGroundhog>;
  switch_4?: Array<ChiangMaiGoose | ArakGroundhog>;
  schedule?: string[];
  schedule_1?: string[];
  schedule_2?: string[];
  schedule_3?: string[];
  schedule_4?: string[];
  model_list?: string[];
  lora_list?: string[];
  schedule_alias?: Array<ScheduleAliasClass | ArakGroundhog>;
  keyframe_list?: Array<ChiangMaiGoose | ArakGroundhog>;
  prepend_text?: Array<ChiangMaiGoose | ArakGroundhog>;
  append_text?: Array<ChiangMaiGoose | ArakGroundhog>;
  file_pattern?: Array<ChiangMaiGoose | ArakGroundhog>;
  interpolated_img?: string[];
  simple_prompt_list?: string[];
  text_1?: Array<ChiangMaiGoose | ArakGroundhog>;
  text_5?: Array<ChiangMaiGoose | ArakGroundhog>;
  text_list_simple?: string[];
  image_5?: string[];
  image_list_simple?: string[];
  alias1?: Array<ChiangMaiGoose | ArakGroundhog>;
  alias2?: Array<ChiangMaiGoose | ArakGroundhog>;
  alias3?: Array<ChiangMaiGoose | ArakGroundhog>;
  alias4?: Array<ChiangMaiGoose | ArakGroundhog>;
  alias5?: Array<ChiangMaiGoose | ArakGroundhog>;
  image_list?: string[];
  remove_background_using_abg?: Array<CalculateHashClass | string>;
  resolution?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  bin_threshold?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  low_threshold?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  high_threshold?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  cmap?: Array<string[] | EsbjergCougar>;
  ckpt_name?: Array<string[] | PurpleCkptName>;
  environment?: Array<string[] | EsbjergCougar>;
  patch_batch_size?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  fov?: Array<BarcelonaHawaiianMonkSeal | string>;
  iterations?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  detect_hand?: Array<string[] | EsbjergCougar>;
  detect_body?: Array<string[] | EsbjergCougar>;
  detect_face?: Array<string[] | EsbjergCougar>;
  pose_estimator?: Array<string[] | EsbjergCougar>;
  safe?: Array<string[] | EsbjergCougar>;
  rm_nearest?: Array<BarcelonaHawaiianMonkSeal | string>;
  rm_background?: Array<BarcelonaHawaiianMonkSeal | string>;
  coarse?: Array<string[] | EsbjergCougar>;
  guassian_sigma?: Array<BarcelonaHawaiianMonkSeal | string>;
  intensity_threshold?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  max_faces?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  min_confidence?: Array<BarcelonaHawaiianMonkSeal | string>;
  mask_bbox_padding?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  mask_type?: Array<string[] | EsbjergCougar>;
  mask_expand?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  rand_seed?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  bg_threshold?: Array<BarcelonaHawaiianMonkSeal | string>;
  score_threshold?: Array<BarcelonaHawaiianMonkSeal | string>;
  dist_threshold?: Array<BarcelonaHawaiianMonkSeal | string>;
  gamma_correction?: Array<BarcelonaHawaiianMonkSeal | string>;
  threshold?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  safe_steps?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  pyrUp_iters?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  preprocessor?: Array<string[] | EsbjergCougar>;
  attn_mask?: string[];
  image_negative?: string[];
  neg_embed?: string[];
  ipadapter?: string[];
  embed2?: string[];
  embed3?: string[];
  embed4?: string[];
  embed5?: string[];
  image_optional?: string[];
  optional_vae?: string[];
  script?: string[];
  cnet_stack?: string[];
  dependencies?: string[];
  X?: string[];
  Y?: string[];
  lora_stack_1?: Lora[];
  lora_stack_2?: Lora[];
  lora_stack_3?: Lora[];
  lora_stack_4?: Lora[];
  lora_stack_5?: Lora[];
  optional_mask?: string[];
  mask_mapping_optional?: string[];
  copy_image_size?: string[];
  image5?: string[];
  image6?: string[];
  base_ctx?: string[];
  step_refiner?: Array<HammerfestPonies | PortoCamel>;
  sampler?: Array<string[] | HammerfestPonies>;
  clip_width?: Array<HammerfestPonies | PortoCamel>;
  clip_height?: Array<HammerfestPonies | PortoCamel>;
  text_pos_g?: Array<HammerfestPonies | ArakGroundhog>;
  text_pos_l?: Array<HammerfestPonies | ArakGroundhog>;
  text_neg_g?: Array<HammerfestPonies | ArakGroundhog>;
  text_neg_l?: Array<HammerfestPonies | ArakGroundhog>;
  control_net?: string[];
  ctx_01?: string[];
  ctx_02?: string[];
  ctx_03?: string[];
  ctx_04?: string[];
  ctx_05?: string[];
  opt_model?: string[];
  opt_clip?: string[];
  insert_lora?: Array<string[]>;
  insert_embedding?: Array<string[]>;
  insert_saved?: Array<string[]>;
  opt_clip_width?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  opt_clip_height?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  target_width?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  target_height?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  crop_width?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  crop_height?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  any_01?: string[];
  any_02?: string[];
  any_03?: string[];
  any_04?: string[];
  any_05?: string[];
  image_b?: string[];
  bus?: string[];
  conditioning?: string[];
  number_as_text?: Array<HammerfestPonies | ArakGroundhog>;
  clipseg_model?: string[];
  image_c?: string[];
  image_d?: string[];
  image_e?: string[];
  image_f?: string[];
  text_d?: Array<Text1Class | ArakGroundhog>;
  text_e?: Array<Text1Class | ArakGroundhog>;
  text_f?: Array<Text1Class | ArakGroundhog>;
  images_a?: string[];
  images_b?: string[];
  images_c?: string[];
  images_d?: string[];
  color_palettes?: Array<HammerfestPonies | string>;
  color_palette_mode?: Array<string[]>;
  reverse_palette?: Array<string[]>;
  filename_text_extension?: Array<string[]>;
  flat?: Array<string[]>;
  RGB_output?: Array<string[]>;
  secondary_model?: string[];
  secondary_start_cycle?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  upscale_model?: string[];
  processor_model?: string[];
  pos_additive?: string[];
  neg_additive?: string[];
  pos_add_mode?: Array<string[]>;
  pos_add_strength?: Array<BarcelonaHawaiianMonkSeal | string>;
  pos_add_strength_scaling?: Array<string[]>;
  pos_add_strength_cutoff?: Array<BarcelonaHawaiianMonkSeal | string>;
  neg_add_mode?: Array<string[]>;
  neg_add_strength?: Array<BarcelonaHawaiianMonkSeal | string>;
  neg_add_strength_scaling?: Array<string[]>;
  neg_add_strength_cutoff?: Array<BarcelonaHawaiianMonkSeal | string>;
  sharpen_strength?: Array<BarcelonaHawaiianMonkSeal | string>;
  sharpen_radius?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  steps_scaling?: Array<string[]>;
  steps_control?: Array<string[]>;
  steps_scaling_value?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  steps_cutoff?: Array<BarcelonaHawaiianMonkSeal | PortoCamel>;
  denoise_cutoff?: Array<BarcelonaHawaiianMonkSeal | string>;
  latent_a?: string[];
  latent_b?: string[];
  latent_c?: string[];
  latent_d?: string[];
  masks_a?: string[];
  masks_b?: string[];
  masks_c?: string[];
  masks_d?: string[];
  mask_c?: string[];
  mask_d?: string[];
  mask_e?: string[];
  mask_f?: string[];
  midas_model?: string[];
  reset_bool?: string[];
  blip_model?: string[];
  dictionary_c?: string[];
  dictionary_d?: string[];
  default_value?: Array<ChiangMaiGoose | ArakGroundhog>;
  key_2?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_2?: Array<ChiangMaiGoose | ArakGroundhog>;
  key_3?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_3?: Array<ChiangMaiGoose | ArakGroundhog>;
  key_4?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_4?: Array<ChiangMaiGoose | ArakGroundhog>;
  key_5?: Array<ChiangMaiGoose | ArakGroundhog>;
  value_5?: Array<ChiangMaiGoose | ArakGroundhog>;
  text_a?: Array<HammerfestPonies | ArakGroundhog>;
  text_b?: Array<Text1Class | ArakGroundhog>;
  list_a?: Array<HammerfestPonies | string>;
  list_b?: Array<HammerfestPonies | string>;
  list_c?: Array<HammerfestPonies | string>;
  list_d?: Array<HammerfestPonies | string>;
  multiline_text?: Array<HammerfestPonies | ArakGroundhog>;
  case_insensitive?: Array<CalculateHashClass | string>;
}

export interface VeClass {}

export interface HammerfestPonies {
  forceInput: boolean;
}

export interface PurpleA {
  default: number | string;
  min?: number;
  max?: number;
  step?: number;
  multiline?: boolean;
}

export interface AOptionalClass {
  multiline: boolean;
  forceInput: boolean;
}

export enum ArakGroundhog {
  String = "STRING",
}

export interface ChiangMaiGoose {
  multiline: boolean;
  default?: string;
}

export interface EsbjergCougar {
  default: null | string;
}

export interface BarcelonaHawaiianMonkSeal {
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  forceInput?: boolean;
}

export enum PortoCamel {
  Int = "INT",
}

export interface BoostClass {
  default: boolean | string;
  label_on?: string;
  label_off?: string;
}

export interface CalculateHashClass {
  default: boolean;
}

export interface CFGClass {
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  round?: number;
  forceInput?: boolean;
}

export interface PurpleCkptName {
  default?: string;
  forceInput?: boolean;
}

export enum DetailerHook {
  DetailerHook = "DETAILER_HOOK",
}

export interface InpaintModelClass {
  default: boolean;
  label_on: LabelOn;
  label_off: LabelOff;
}

export enum LabelOff {
  Disabled = "disabled",
}

export enum LabelOn {
  Enabled = "enabled",
}

export enum Lora {
  LoraStack = "LORA_STACK",
}

export interface ScheduleAliasClass {
  "default prompt": string;
  multiline: boolean;
}

export interface Text1Class {
  forceInput?: boolean;
  multiline?: boolean;
  default?: string;
  dynamicPrompts?: boolean;
}

export interface PurpleRequired {
  content: string;
  image: null | string;
  type?: Type;
}

export enum Type {
  Loras = "loras",
}

export interface FluffyRequired {
  default?: unknown[] | boolean | number | null | string;
  multiline?: boolean;
  min?: number;
  max?: number;
  step?: number;
  round?: boolean | number;
  forceInput?: boolean;
  image_upload?: boolean;
  display?: Display;
  label_on?: string;
  label_off?: string;
  dynamicPrompts?: boolean;
  "pysssss.autocomplete"?: boolean | PysssssAutocompleteClass;
  "pysssss.binding"?: PysssssBinding[];
  placeholder?: string;
  choices?: string[];
}

export enum Display {
  Color = "color",
  Number = "number",
  Slider = "slider",
}

export interface PysssssAutocompleteClass {
  words: Word[];
  separator: string;
}

export interface Word {
  text: string;
  value: string;
  showValue: boolean;
  hint: string;
  caretOffset: number;
}

export interface PysssssBinding {
  source: string;
  callback: Callback[];
}

export interface Callback {
  type: string;
  target?: string;
  value?: boolean;
  url?: string;
  then?: Then[];
  condition?: Condition[];
  true?: False[];
  false?: False[];
}

export interface Condition {
  left: string;
  op: string;
  right: string;
}

export interface False {
  type: string;
  target: string;
  value: boolean;
}

export interface Then {
  type: string;
  target?: string;
  value?: boolean | string;
}
