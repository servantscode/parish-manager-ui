import { Identifiable } from './identifiable';

export class Note extends Identifiable {
  constructor() {
    super();
  }

  creatorId: number;
  creator: string;
  createdTime: Date;
  edited: boolean;
  private: boolean;
  resourceType: string;
  resourceId: number;
  note: string;

  public identify(): string {
    return this.note;
  }

  public asTemplate(): Note {
    this.id=0;
    this.creatorId=0;
    this.creator='';
    this.createdTime=new Date();
    this.edited=false;
    this.private=false;
    this.resourceType='';
    this.resourceId=0;
    this.note='';
    return this;
  }
}
