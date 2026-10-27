import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
const singles=['home','settings']
export default defineConfig({name:'kismart',title:'Kismart Beauty Products',projectId:process.env.SANITY_STUDIO_PROJECT_ID||'your_project_id',dataset:process.env.SANITY_STUDIO_DATASET||'production',
 plugins:[structureTool({structure:S=>S.list().title('Content').items([S.listItem().title('Products').child(S.documentTypeList('product')),S.listItem().title('Categories').child(S.documentTypeList('category')),S.divider(),
  S.listItem().title('Homepage').child(S.document().schemaType('home').documentId('home')),S.listItem().title('Website settings').child(S.document().schemaType('settings').documentId('settings'))])})],
 schema:{types:schemaTypes,templates:t=>t.filter(x=>!singles.includes(x.schemaType))},document:{actions:(a,{schemaType})=>singles.includes(schemaType)?a.filter(x=>['publish','discardChanges','restore'].includes(x.action)):a}})
