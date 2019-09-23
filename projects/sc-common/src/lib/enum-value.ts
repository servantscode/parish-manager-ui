export class EnumValue {

  constructor(public value: string) {
    this.display = this.toTitleCase(value);
  }

  display: string;

  private toTitleCase(input: string) {
		var bits = input.toLowerCase().split('_');
		for (var i = 0; i < bits.length; i++) {
			bits[i] = bits[i].charAt(0).toUpperCase() + bits[i].slice(1);
		}
		return bits.join(' ');
  }
}
